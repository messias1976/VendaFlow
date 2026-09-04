import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, Headers, Param, Patch, Post, Query } from '@nestjs/common';
import { randomBytes, scryptSync } from 'crypto';
import { db, MasterRole, Prisma } from '@vendaflow/db';

type Permission = 'tenants:read' | 'tenants:write' | 'tenants:delete' | 'users:write' | 'agents:write' | 'whatsapp:write' | 'audit:read';
type CreateTenantInput = { name: string; plan?: string; userName: string; userEmail: string; userPassword?: string; agentName?: string; systemPrompt?: string };

const permissions: Record<MasterRole, Permission[]> = {
    SUPER_ADMIN: ['tenants:read', 'tenants:write', 'tenants:delete', 'users:write', 'agents:write', 'whatsapp:write', 'audit:read'],
    ADMIN_OPERACIONAL: ['tenants:read', 'tenants:write', 'users:write', 'agents:write', 'whatsapp:write', 'audit:read'],
    SUPORTE: ['tenants:read', 'agents:write', 'whatsapp:write', 'audit:read'],
    FINANCEIRO: ['tenants:read', 'tenants:write', 'audit:read'],
};

function passwordHash(password: string) { const salt = randomBytes(16).toString('hex'); return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`; }
function slugify(value: string) { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

@Controller('master')
export class MasterController {
    private authorize(roleHeader: string | undefined, permission: Permission) {
        const role = roleHeader as MasterRole;
        if (!permissions[role]?.includes(permission)) throw new ForbiddenException('Esta função Master não possui essa permissão.');
        return role;
    }
    private audit(action: string, tenantId: string | undefined, role: MasterRole, metadata?: Record<string, unknown>) { return db.auditEvent.create({ data: { action, tenantId, actorId: `master:${role}`, metadata: metadata as Prisma.InputJsonValue } }); }

    @Get('tenants')
    listTenants(@Headers('x-master-role') role: string) { this.authorize(role, 'tenants:read'); return db.tenant.findMany({ orderBy: { createdAt: 'desc' }, include: { users: { select: { id: true, name: true, email: true, isActive: true, role: true } }, agents: true, whatsapp: true } }); }

    @Post('tenants')
    async createTenant(@Headers('x-master-role') roleHeader: string, @Body() input: CreateTenantInput) {
        const role = this.authorize(roleHeader, 'tenants:write');
        if (!input.name?.trim() || !input.userName?.trim() || !input.userEmail?.trim()) throw new BadRequestException('Nome da empresa, nome do usuário e e-mail são obrigatórios.');
        const password = input.userPassword?.trim() || randomBytes(9).toString('base64url');
        const tenant = await db.tenant.create({ data: { name: input.name.trim(), slug: `${slugify(input.name) || 'empresa'}-${randomBytes(3).toString('hex')}`, plan: input.plan || 'STARTER', users: { create: { name: input.userName.trim(), email: input.userEmail.trim().toLowerCase(), passwordHash: passwordHash(password), role: 'OWNER' } }, agents: { create: { name: input.agentName?.trim() || 'Luna', systemPrompt: input.systemPrompt?.trim() || 'Você é um agente de vendas prestativo e objetivo.' } } }, include: { users: { select: { id: true, name: true, email: true, isActive: true, role: true } }, agents: true, whatsapp: true } });
        await this.audit('TENANT_CREATED', tenant.id, role, { plan: tenant.plan });
        return { tenant, initialPassword: password };
    }

    @Patch('tenants/:tenantId')
    async updateTenant(@Headers('x-master-role') roleHeader: string, @Param('tenantId') tenantId: string, @Body() input: { name?: string; plan?: string; isActive?: boolean }) {
        const role = this.authorize(roleHeader, 'tenants:write');
        const tenant = await db.tenant.update({ where: { id: tenantId }, data: { ...(input.name?.trim() ? { name: input.name.trim() } : {}), ...(input.plan ? { plan: input.plan } : {}), ...(typeof input.isActive === 'boolean' ? { isActive: input.isActive, suspendedAt: input.isActive ? null : new Date() } : {}) } });
        await this.audit('TENANT_UPDATED', tenantId, role, input);
        return tenant;
    }

    @Delete('tenants/:tenantId')
    async deleteTenant(@Headers('x-master-role') roleHeader: string, @Param('tenantId') tenantId: string) {
        const role = this.authorize(roleHeader, 'tenants:delete');
        await this.audit('TENANT_DELETED', tenantId, role);
        await db.tenant.delete({ where: { id: tenantId } });
        return { tenantId, deleted: true };
    }

    @Patch('tenants/:tenantId/access')
    async updateAccess(@Headers('x-master-role') roleHeader: string, @Param('tenantId') tenantId: string, @Body() input: { userId?: string; isActive: boolean }) {
        const role = this.authorize(roleHeader, 'users:write');
        const user = await db.user.updateMany({ where: { tenantId, ...(input.userId ? { id: input.userId } : { role: 'OWNER' }) }, data: { isActive: input.isActive } });
        if (!user.count) throw new BadRequestException('Usuário de acesso não encontrado.');
        await this.audit(input.isActive ? 'USER_ACCESS_GRANTED' : 'USER_ACCESS_BLOCKED', tenantId, role, { userId: input.userId });
        return { tenantId, isActive: input.isActive };
    }

    @Get('tenants/:tenantId/users')
    listUsers(@Headers('x-master-role') role: string, @Param('tenantId') tenantId: string) { this.authorize(role, 'tenants:read'); return db.user.findMany({ where: { tenantId }, select: { id: true, name: true, email: true, isActive: true, role: true } }); }

    @Post('tenants/:tenantId/users')
    async createUser(@Headers('x-master-role') roleHeader: string, @Param('tenantId') tenantId: string, @Body() input: { name: string; email: string; role?: 'ADMIN' | 'AGENT' }) {
        const role = this.authorize(roleHeader, 'users:write');
        if (!input.name?.trim() || !input.email?.trim()) throw new BadRequestException('Nome e e-mail são obrigatórios.');
        const password = randomBytes(9).toString('base64url');
        const user = await db.user.create({ data: { tenantId, name: input.name.trim(), email: input.email.trim().toLowerCase(), role: input.role || 'AGENT', passwordHash: passwordHash(password) }, select: { id: true, name: true, email: true, isActive: true, role: true } });
        await this.audit('USER_INVITED', tenantId, role, { userId: user.id, role: user.role });
        return { user, initialPassword: password };
    }

    @Patch('tenants/:tenantId/agent')
    async updateAgent(@Headers('x-master-role') roleHeader: string, @Param('tenantId') tenantId: string, @Body() input: { name: string; systemPrompt: string; personality?: string; rules?: string; schedule?: string; model?: string; messageLimit?: number; isActive: boolean }) {
        const role = this.authorize(roleHeader, 'agents:write');
        const agent = await db.agent.findFirst({ where: { tenantId }, orderBy: { name: 'asc' } });
        if (!agent) throw new BadRequestException('Agente não encontrado.');
        const updated = await db.agent.update({ where: { id: agent.id }, data: { name: input.name.trim(), systemPrompt: input.systemPrompt.trim(), personality: input.personality?.trim(), rules: input.rules?.trim(), schedule: input.schedule?.trim(), model: input.model?.trim(), messageLimit: input.messageLimit, isActive: input.isActive } });
        await this.audit('AGENT_UPDATED', tenantId, role, { agentId: agent.id });
        return updated;
    }

    @Patch('tenants/:tenantId/whatsapp')
    async updateWhatsapp(@Headers('x-master-role') roleHeader: string, @Param('tenantId') tenantId: string, @Body() input: { phoneNumber: string; displayName?: string; status?: string; webhookVerified?: boolean; isActive?: boolean }) {
        const role = this.authorize(roleHeader, 'whatsapp:write');
        const existing = await db.whatsappConnection.findFirst({ where: { tenantId, phoneNumber: input.phoneNumber } });
        const connection = existing ? await db.whatsappConnection.update({ where: { id: existing.id }, data: { displayName: input.displayName, status: input.status, webhookVerified: input.webhookVerified, isActive: input.isActive } }) : await db.whatsappConnection.create({ data: { tenantId, phoneNumber: input.phoneNumber, displayName: input.displayName, status: input.status || 'PENDING', webhookVerified: input.webhookVerified || false, isActive: input.isActive || false } });
        await this.audit('WHATSAPP_UPDATED', tenantId, role, { connectionId: connection.id, status: connection.status });
        return connection;
    }

    @Get('audit')
    listAudit(@Headers('x-master-role') role: string, @Query('tenantId') tenantId?: string) { this.authorize(role, 'audit:read'); return db.auditEvent.findMany({ where: tenantId ? { tenantId } : undefined, orderBy: { createdAt: 'desc' }, take: 200 }); }
}

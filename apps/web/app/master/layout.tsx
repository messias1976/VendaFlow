import { ClientSwitcher } from './components/client-switcher';
export default function MasterLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <><ClientSwitcher />{children}</> }

import DiditSdkProvider from './DiditSdkProvider'
import { ThemeButton } from './ThemeButton'
import { UserStatus } from './UserStatus'
import { ModalButton } from './ModalButton'
import './styles.css'

export default function App() {
  // 4. Use modal hook

  return (
    <DiditSdkProvider>
      <div className="row">
        <didit-button />
        <ThemeButton />
      </div>
      <div className="row">
        <ModalButton />
      </div>
      <UserStatus />
      <didit-callback></didit-callback>
    </DiditSdkProvider>
  )
}

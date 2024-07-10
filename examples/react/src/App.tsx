import DiditSdkProvider from './DiditSdkProvider'
import { ThemeButton } from './ThemeButton'
import { UserStatus } from './UserStatus'
import { ModalButton } from './ModalButton'
import './styles.css'

export default function App() {
  // 4. Use modal hook

  return (
    <DiditSdkProvider>
      <div className="header">
        <ThemeButton />
        <didit-button />
      </div>
      <div className="modal-button">
        <ModalButton />
      </div>
      <UserStatus />
      <didit-callback></didit-callback>
    </DiditSdkProvider>
  )
}

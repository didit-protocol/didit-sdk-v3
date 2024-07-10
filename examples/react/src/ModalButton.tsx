import { useDiditSdk } from '@didit-sdk/react'

export function ModalButton() {
  const { isOpen, openModal, closeModal } = useDiditSdk()

  const handleClick = () => {
    if (isOpen) {
      closeModal()
    } else {
      openModal()
    }
  }

  return (
    <button type="button" id="modal-btn" onClick={handleClick}>
      {isOpen ? 'Close Modal' : 'Open Modal'}
    </button>
  )
}

export const useModal = (modal: string) => {
    const modalState = useState<boolean>(`modal-${modal}`, () => false)

    const toggleModal = () => modalState.value = !modalState.value

    const openModal = () => modalState.value = true

    const closeModal = () => modalState.value = false

    return {
        isOpen: modalState,
        toggleModal,
        openModal,
        closeModal,
    }
}
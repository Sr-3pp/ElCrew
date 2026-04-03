<script setup lang="ts">
const { isOpen: bookModal, toggleModal: toggleBookModal } = useModal('book')
</script>

<template lang="pug">
UApp
	UMain
		Navbar
		NuxtRouteAnnouncer
		NuxtPage
		div(class="fixed bottom-2 right-2")
			UColorModeSwitch
		Footer
		ModalBookClass
</template>

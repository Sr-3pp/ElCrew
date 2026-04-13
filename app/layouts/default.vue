<script setup lang="ts">
useModal('book')
</script>

<template lang="pug">
UApp
	UMain
		Navbar
		NuxtRouteAnnouncer
		NuxtPage
		div(class="fixed bottom-2 right-2")
			UColorModeSwitch
		PartnerBar
		Footer
		ModalBookClass
</template>

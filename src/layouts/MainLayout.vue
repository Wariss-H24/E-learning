<script setup>
import SidebarComponent from '@/components/SidebarComponent.vue'
import ProductsView from '@/views/ProductsView.vue'
</script>

<template>
  <div class="flex min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-900">
    <SidebarComponent />
    <ProductsView />
  </div>
</template>

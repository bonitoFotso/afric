<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <!-- Header Principal -->
    <header class="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo et Navigation -->
          <div class="flex items-center">
            <!-- Logo -->
            <div class="flex-shrink-0 flex items-center">
              <div class="w-10 h-10 bg-gradient-to-br from-[#00cfc2] to-[#00b5aa] rounded-lg flex items-center justify-center mr-3">
                <CreditCard class="h-6 w-6 text-white" />
              </div>
              <div class="hidden sm:block">
                <span class="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  @fric
                </span>
                <div class="text-xs text-gray-500 -mt-1">Votre banque digitale</div>
              </div>
            </div>

            <!-- Navigation Desktop -->
            <nav class="hidden md:ml-8 md:flex md:space-x-1">
              <NavigationMenu class="relative">
                <NavigationMenuList class="flex space-x-1">
                  <NavigationMenuItem>
                    <router-link
                      to="/dashboard"
                      class="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-[#00cfc2]/10 hover:text-[#00cfc2] focus:bg-[#00cfc2]/10 focus:text-[#00cfc2] focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                      :class="{
                        'bg-[#00cfc2]/15 text-[#00cfc2] font-semibold': $route.name === 'dashboard',
                        'text-gray-700': $route.name !== 'dashboard'
                      }"
                    >
                      <LayoutDashboard class="h-4 w-4 mr-2" />
                      Dashboard
                    </router-link>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <router-link
                      to="/transfer"
                      class="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-[#00cfc2]/10 hover:text-[#00cfc2] focus:bg-[#00cfc2]/10 focus:text-[#00cfc2] focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                      :class="{
                        'bg-[#00cfc2]/15 text-[#00cfc2] font-semibold': $route.name === 'transfer',
                        'text-gray-700': $route.name !== 'transfer'
                      }"
                    >
                      <ArrowRightLeft class="h-4 w-4 mr-2" />
                      Virement
                    </router-link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </nav>
          </div>

          <!-- Actions utilisateur -->
          <div class="flex items-center space-x-4">
            <!-- Notifications -->
            <Button variant="ghost" size="sm" class="relative hidden sm:flex">
              <Bell class="h-4 w-4" />
              <Badge
                variant="destructive"
                class="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-[#00cfc2] hover:bg-[#00cfc2]"
              >
                2
              </Badge>
            </Button>

            <!-- Menu utilisateur -->
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" class="flex items-center space-x-3 hover:bg-[#00cfc2]/5">
                  <div class="hidden sm:block text-right">
                    <div class="text-sm font-medium text-gray-900">
                      {{ authStore.user?.name }}
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ authStore.user?.email }}
                    </div>
                  </div>
                  <Avatar class="h-8 w-8">
                    <AvatarImage :src="authStore.user?.avatar" />
                    <AvatarFallback class="bg-[#00cfc2] text-white text-sm">
                      {{ getInitials(authStore.user?.name) }}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown class="h-4 w-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" class="w-56">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User class="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings class="mr-2 h-4 w-4" />
                  <span>Paramètres</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard class="mr-2 h-4 w-4" />
                  <span>Mes cartes</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <HelpCircle class="mr-2 h-4 w-4" />
                  <span>Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="handleLogout" class="text-red-600">
                  <LogOut class="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <!-- Menu mobile -->
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  class="md:hidden"
                >
                  <Menu class="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" class="w-80">
                <SheetHeader>
                  <SheetTitle class="flex items-center">
                    <div class="w-8 h-8 bg-gradient-to-br from-[#00cfc2] to-[#00b5aa] rounded-lg flex items-center justify-center mr-2">
                      <CreditCard class="h-4 w-4 text-white" />
                    </div>
                    @fric
                  </SheetTitle>
                  <SheetDescription>
                    Connecté en tant que {{ authStore.user?.name }}
                  </SheetDescription>
                </SheetHeader>

                <div class="py-6">
                  <nav class="space-y-2">
                    <router-link
                      to="/dashboard"
                      class="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      :class="{
                        'bg-[#00cfc2]/15 text-[#00cfc2]': $route.name === 'dashboard',
                        'text-gray-700 hover:bg-gray-100': $route.name !== 'dashboard'
                      }"
                    >
                      <LayoutDashboard class="h-4 w-4 mr-3" />
                      Dashboard
                    </router-link>

                    <router-link
                      to="/transfer"
                      class="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      :class="{
                        'bg-[#00cfc2]/15 text-[#00cfc2]': $route.name === 'transfer',
                        'text-gray-700 hover:bg-gray-100': $route.name !== 'transfer'
                      }"
                    >
                      <ArrowRightLeft class="h-4 w-4 mr-3" />
                      Virement
                    </router-link>

                    <router-link
                      to="/settings"
                      class="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      :class="{
                        'bg-[#00cfc2]/15 text-[#00cfc2]': $route.name === 'settings',
                        'text-gray-700 hover:bg-gray-100': $route.name !== 'settings'
                      }"
                    >
                      <Settings class="h-4 w-4 mr-3" />
                      Paramètres
                    </router-link>
                  </nav>
                </div>

                <Separator />

                <div class="py-4 space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    class="w-full justify-start"
                  >
                    <User class="h-4 w-4 mr-3" />
                    Profil
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    class="w-full justify-start"
                  >
                    <HelpCircle class="h-4 w-4 mr-3" />
                    Support
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    class="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    @click="handleLogout"
                  >
                    <LogOut class="h-4 w-4 mr-3" />
                    Déconnexion
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenu principal -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col sm:flex-row items-center justify-between">
          <div class="flex items-center space-x-4 mb-4 sm:mb-0">
            <div class="w-6 h-6 bg-gradient-to-br from-[#00cfc2] to-[#00b5aa] rounded flex items-center justify-center">
              <CreditCard class="h-3 w-3 text-white" />
            </div>
            <span class="text-sm text-gray-600">
              © 2025 BankApp. Tous droits réservés.
            </span>
          </div>
          <div class="flex items-center space-x-6 text-sm text-gray-500">
            <button class="hover:text-[#00cfc2] transition-colors">
              Politique de confidentialité
            </button>
            <button class="hover:text-[#00cfc2] transition-colors">
              Conditions d'utilisation
            </button>
            <button class="hover:text-[#00cfc2] transition-colors">
              Support
            </button>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import {
  CreditCard,
  LogOut,
  User,
  Settings,
  Bell,
  ChevronDown,
  Menu,
  HelpCircle,
  LayoutDashboard,
  ArrowRightLeft,
  Receipt
} from 'lucide-vue-next';

import { useAuthStore } from '@/stores/auth';

// Composants shadcn/ui
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

const router = useRouter();
const authStore = useAuthStore();

function handleLogout() {
  authStore.logout();
  router.push('/login');
}

function getInitials(name?: string): string {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(n => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
</script>

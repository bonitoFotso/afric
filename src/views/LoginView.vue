<template>
  <div class="min-h-screen flex bg-gradient-to-br from-slate-50 to-slate-100">
    <!-- Section Illustration (côté gauche) -->
    <div class="hidden lg:flex lg:w-1/2 bg-[#00cfc2] relative overflow-hidden">
      <!-- Motifs décoratifs -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-20 left-20 w-32 h-32 rounded-full border-2 border-white"></div>
        <div class="absolute top-40 right-32 w-24 h-24 rounded-full border border-white"></div>
        <div class="absolute bottom-32 left-32 w-16 h-16 rounded-full border border-white"></div>
        <div class="absolute bottom-20 right-20 w-40 h-40 rounded-full border-2 border-white"></div>
      </div>

      <!-- Contenu principal -->
      <div class="flex flex-col justify-center items-center text-white p-12 relative z-10">
        <!-- Icône principale -->
        <div class="mb-8">
          <div class="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6">
            <CreditCard class="w-12 h-12 text-white" />
          </div>
        </div>

        <!-- Titre et description -->
        <h1 class="text-4xl font-bold text-center mb-4">
          Bienvenue sur votre<br>espace bancaire
        </h1>
        <p class="text-xl text-center text-white/90 max-w-md leading-relaxed">
          Gérez vos comptes, effectuez vos virements et suivez vos dépenses en toute sécurité
        </p>

        <!-- Éléments visuels supplémentaires -->
        <div class="mt-12 grid grid-cols-3 gap-4 opacity-80">
          <div class="flex flex-col items-center text-center">
            <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-2">
              <Shield class="w-6 h-6" />
            </div>
            <span class="text-sm">Sécurisé</span>
          </div>
          <div class="flex flex-col items-center text-center">
            <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-2">
              <Clock class="w-6 h-6" />
            </div>
            <span class="text-sm">24h/24</span>
          </div>
          <div class="flex flex-col items-center text-center">
            <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-2">
              <Smartphone class="w-6 h-6" />
            </div>
            <span class="text-sm">Mobile</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Formulaire (côté droit) -->
    <div class="flex-1 flex items-center justify-center p-8 lg:p-12">
      <div class="w-full max-w-md space-y-8">
        <!-- En-tête mobile -->
        <div class="lg:hidden text-center mb-8">
          <div class="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-[#00cfc2]/10 mb-4">
            <CreditCard class="h-8 w-8 text-[#00cfc2]" />
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">
            Connexion
          </h2>
          <p class="text-gray-600">
            Accédez à vos services bancaires
          </p>
        </div>

        <!-- En-tête desktop -->
        <div class="hidden lg:block">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">
            Connexion à votre compte
          </h2>
          <p class="text-gray-600">
            Saisissez vos identifiants pour accéder à votre espace
          </p>
        </div>

        <!-- Formulaire -->
        <form class="space-y-6" @submit.prevent="handleLogin">
          <!-- Message d'erreur -->
          <Alert v-if="error" variant="destructive" class="border-red-200 bg-red-50">
            <AlertCircle class="h-4 w-4" />
            <AlertDescription>{{ error }}</AlertDescription>
          </Alert>

          <!-- Champ nom d'utilisateur -->
          <div class="space-y-2">
            <Label for="username" class="text-sm font-medium text-gray-700">
              Nom d'utilisateur
            </Label>
            <div class="relative">
              <User class="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="username"
                v-model="credentials.username"
                type="text"
                placeholder="alice"
                required
                class="pl-10 h-12 border-gray-200 focus:border-[#00cfc2] focus:ring-[#00cfc2]"
                :class="{ 'border-red-300': errors.username }"
              />
            </div>
            <p v-if="errors.username" class="text-sm text-red-600">
              {{ errors.username }}
            </p>
          </div>

          <!-- Champ mot de passe -->
          <div class="space-y-2">
            <Label for="password" class="text-sm font-medium text-gray-700">
              Mot de passe
            </Label>
            <div class="relative">
              <Lock class="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                v-model="credentials.password"
                type="password"
                placeholder="••••••••"
                required
                class="pl-10 h-12 border-gray-200 focus:border-[#00cfc2] focus:ring-[#00cfc2]"
                :class="{ 'border-red-300': errors.password }"
              />
            </div>
            <p v-if="errors.password" class="text-sm text-red-600">
              {{ errors.password }}
            </p>
          </div>

          <!-- Options supplémentaires -->
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <Checkbox id="remember" class="border-gray-300" />
              <Label for="remember" class="text-sm text-gray-600">
                Se souvenir de moi
              </Label>
            </div>
            <button type="button" class="text-sm text-[#00cfc2] hover:text-[#00cfc2]/80 font-medium">
              Mot de passe oublié ?
            </button>
          </div>

          <!-- Bouton de connexion -->
          <Button
            type="submit"
            :disabled="!isFormValid || authStore.loading"
            class="w-full h-12 bg-[#00cfc2] hover:bg-[#00cfc2]/90 text-white font-medium"
          >
            <Loader2 v-if="authStore.loading" class="mr-2 h-4 w-4 animate-spin" />
            {{ authStore.loading ? 'Connexion...' : 'Se connecter' }}
          </Button>

          <!-- Compte de démonstration -->

        </form>

        <!-- Footer -->
        <div class="text-center text-xs text-gray-500">
          <p>En vous connectant, vous acceptez nos conditions d'utilisation</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  CreditCard,
  User,
  Lock,
  Loader2,
  AlertCircle,
  Shield,
  Clock,
  Smartphone
} from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';

// Composants shadcn/ui
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';

const router = useRouter();
const authStore = useAuthStore();

const credentials = ref({
  username: '',
  password: ''
});

const errors = ref({
  username: '',
  password: ''
});

const error = ref('');

const isFormValid = computed(() => {
  return credentials.value.username.trim().length > 0 &&
         credentials.value.password.trim().length > 0;
});

async function handleLogin() {
  error.value = '';
  errors.value = { username: '', password: '' };

  try {
    await authStore.login(credentials.value);
    router.push('/dashboard');
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erreur de connexion';
  }
}
</script>

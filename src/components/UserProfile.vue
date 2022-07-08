<template>
  <q-card flat>
    <q-card-section>
      <q-avatar size="120px" :color="!authUser.photoURL ? 'grey-5' : ''">
        <img
          v-if="authUser.photoURL && !cropImage"
          :src="authUser.photoURL"
          alt=""
        />
        <img v-else-if="cropImage" :src="cropImage.toDataURL()" alt="" />
        <q-icon v-else color="white" size="50px" name="fas fa-user" />
        <q-btn
          color="primary"
          @click="uploadImage"
          size="sm"
          class="camera-btn absolute"
          round
          icon="photo_camera"
        />
      </q-avatar>
      <q-file
        v-model="imgFile"
        @update:model-value="handleCropperDialog"
        @rejected="notValidImage"
        ref="imgInput"
        class="hidden"
        accept=".jpg, image/*"
      />

      <!-- Profile Details -->
      <div class="profile-caption">
        <div class="text-subtitle1 text-bold">
          {{ authUser.displayName }}
        </div>
        <div class="text-subtitle2">
          <q-icon class="q-mr-sm" name="email" color="primary" />
          <span>{{ authUser.email }}</span>
        </div>
        <div v-show="authUser.address" class="text-subtitle2 q-mb-sm">
          <q-icon
            class="q-mr-sm"
            name="fas fa-map-marker-alt"
            color="primary"
          />
          <span>{{ authUser.address }}</span>
        </div>
        <div class="text-caption">
          {{ authUser.bio }}
        </div>
      </div>
    </q-card-section>

    <q-card-section v-if="profile">
      <!-- List of Social Links -->
      <q-list dense>
        <q-item v-for="link in profile.social_links" :key="link.platform">
          <q-item-section avatar>
            <q-icon
              class="text-primary"
              size="xs"
              :name="'ti-' + link.platform.toLowerCase()"
            />
          </q-item-section>

          <q-item-section
            @click="openLink(link)"
            class="cursor-pointer text-primary"
          >
            <q-item-label>{{ link.username }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn
              @click="deleteSocialLink(link)"
              flat
              round
              size="xs"
              icon="ti-close"
              color="negative"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <q-card-section style="max-width: 600px">
      <div class="text-subtitle2 q-mb-sm">Add social links</div>
      <q-select
        dense
        label="Platform"
        v-model="social_links.platform"
        standout="bg-primary text-white"
        @update:model-value="addLink"
        :options="platforms"
      />

      <transition
        appear
        enter-active-class="animated fadeInUp"
        leave-active-class="animated fadeOutDown"
      >
        <div class="q-gutter-y-sm q-mt-md" v-if="social_links.platform">
          <q-input
            v-model="social_links.username"
            dense
            outlined
            placeholder="Username"
          />
          <div class="text-right q-gutter-x-md">
            <q-btn
              @click="saveSocialLink"
              unelevated
              flat
              dense
              no-caps
              color="negative"
              label="Cancel"
            />
            <q-btn
              @click="saveSocialLink"
              :disable="!social_links.username"
              unelevated
              flat
              dense
              no-caps
              color="primary"
              label="Save"
              :loading="isLoading"
            />
          </div>
        </div>
      </transition>
    </q-card-section>
  </q-card>
</template>
<style lang="sass">
.camera-btn
  bottom: 5px
  right: 2px
</style>
<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useAuthStore } from "stores/auth";
import { useUserStore } from "stores/users";
import { useQuasar } from "quasar";
import AvatarCropper from "./dialogs/AvatarCropper.vue";

const authStore = useAuthStore(),
  $q = useQuasar(),
  userStore = useUserStore();

const authUser = computed(() => authStore.authUser),
  profile = computed(() => userStore.userProfile);

onMounted(() => userStore.getUserProfile(authUser.value.uid));

const cropImage = ref(null);
const imgFile = ref([]);
const imgInput = ref();
const uploadImage = () => {
  imgInput.value.pickFiles();
};

const notValidImage = (file) => {
  console.log(file);
  $q.dialog({
    title: "We're sorry",
    message: "The file type is not allowed.",
  });
};

const handleCropperDialog = (file) => {
  const blob = URL.createObjectURL(file);
  $q.dialog({
    component: AvatarCropper,
    componentProps: {
      blob: blob,
    },
  })
    .onOk((result) => {
      cropImage.value = result;
    })
    .onCancel(() => {
      imgFile.value = null;
    })
    .onDismiss(() => {
      imgFile.value = null;
    });
};

//Add Social Links
const isLoading = ref(false);
const platforms = ["Facebook", "Twitter", "Instagram", "LinkedIn", "Youtube"];
const social_links = reactive({
  platform: "",
  username: "",
});
const addLink = (platform) => {
  social_links.platform = platform;
};
const saveSocialLink = async () => {
  isLoading.value = true;
  const res = await userStore.updateUserProfile({ link: { ...social_links } });

  if (res) {
    social_links.platform = "";
    social_links.username = "";
    isLoading.value = false;
  }
};
const openLink = (link) => {
  let url = "https://" + link.platform.toLowerCase() + ".com/";
  openURL(url + link.username);
};

// Delete Social Link
const deleteSocialLink = (link) => {
  userStore.updateUserProfile({ delete: true, link: link });
};
</script>

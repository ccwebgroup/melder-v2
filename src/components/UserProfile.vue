<template>
  <q-card flat>
    <q-card-section>
      <q-avatar size="120px" color="grey-5">
        <q-img
          v-if="authUser.photoURL && !cropImage"
          :src="authUser.photoURL"
          alt=""
          loading="eager"
        />
        <q-img
          loading="eager"
          v-else-if="cropImage"
          :src="cropImage.toDataURL()"
          alt=""
        />
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
      <!-- Hidden Input -->
      <q-file
        v-model="imgFile"
        @update:model-value="handleCropperDialog"
        @rejected="notValidImage"
        ref="imgInput"
        class="hidden"
        accept=".jpg, image/*"
      />

      <!-- Profile Details -->
      <div class="profile">
        <div class="text-subtitle2">
          <q-icon class="q-mr-sm" name="person" color="primary" />
          <span>{{ authUser.displayName }}</span>
        </div>
        <div class="text-caption">
          <q-icon class="q-mr-sm" name="email" color="primary" />
          <span>{{ authUser.email }}</span>
        </div>
      </div>
      <q-item-label class="q-mt-md">Details</q-item-label>
      <div style="max-width: 500px" class="q-mx-auto">
        <q-form @submit="updatingDisplayName" class="q-mt-sm">
          <q-input
            v-model="profileForm.displayName"
            dense
            outlined
            placeholder="Change display name"
          />
          <q-card-actions align="right">
            <q-card-actions class="q-pa-none" align="right">
              <q-btn
                :disable="!profileForm.displayName"
                flat
                type="submit"
                no-caps
                dense
                label="Update"
                color="primary"
              />
            </q-card-actions>
          </q-card-actions>
        </q-form>
      </div>
    </q-card-section>

    <q-separator spaced />

    <q-card-section v-if="profile">
      <!-- List of Social Links -->
      <q-item-label>Social</q-item-label>
      <q-list dense style="max-width: 500px" class="q-mx-auto">
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

    <q-card-section>
      <q-item-label class="q-mb-sm">Add social links</q-item-label>
      <div style="max-width: 500px" class="q-mx-auto">
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
                @click="clearLinks"
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
      </div>
    </q-card-section>

    <q-separator spaced />

    <q-card-section>
      <q-item-label class="q-mb-sm">Security</q-item-label>
      <div style="max-width: 500px" class="q-mx-auto">
        <q-form @submit="updatePassword">
          <q-input
            v-model="profileForm.password"
            type="password"
            dense
            outlined
            placeholder="Password"
          />
          <q-card-actions class="q-pa-none" align="right">
            <q-btn
              :disable="!profileForm.password"
              flat
              type="submit"
              no-caps
              dense
              label="Update"
              color="primary"
            />
          </q-card-actions>
        </q-form>
      </div>
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

const profileForm = reactive({
  displayName: "",
  password: "",
});

const updatingDisplayName = () => {
  authStore.updateDisplayName(profileForm.displayName);
};

const updatePassword = async () => {
  const res = await authStore.updatePassword(profileForm.password);
  if (res) {
    profileForm.password = "";
  }
};

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
      result.toBlob(async (blob) => {
        const image = await blob;
        userStore.updatePhoto(image);
      });
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
const clearLinks = () => {
  social_links.platform = "";
  social_links.username = "";
};
const saveSocialLink = async () => {
  isLoading.value = true;
  const res = await userStore.updateSocial({ link: { ...social_links } });

  if (res) {
    clearLinks();
    isLoading.value = false;
  }
};
const openLink = (link) => {
  let url = "https://" + link.platform.toLowerCase() + ".com/";
  openURL(url + link.username);
};

// Delete Social Link
const deleteSocialLink = (link) => {
  userStore.updateSocial({ delete: true, link: link });
};
</script>

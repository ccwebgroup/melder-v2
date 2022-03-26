<template>
  <q-page>
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <q-card v-show="!loading" flat>
        <!-- Basic Information -->
        <q-card-section class="q-py-none q-mb-sm">
          <!-- Avatar Section -->
          <q-avatar size="80px" v-if="authUser.photoURL">
            <img id="profile-avatar" :src="authUser.photoURL + Date.now()" />
          </q-avatar>
          <q-avatar
            v-else
            size="100px"
            color="teal"
            text-color="white"
            class="text-bold"
            >{{ authUser.displayName[0].toUpperCase() }}</q-avatar
          >
          <div class="float-right">
            <q-btn
              @click="editingMode(authUser)"
              no-caps
              rounded
              outline
              padding="xs md"
              :color="$q.dark.isActive ? 'secondary' : 'primary'"
              label="Edit Profile"
            />
          </div>
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

        <!-- Groups Manage -->
        <q-card-section class="q-py-none">
          <div class="text-subtitle2 text-bold">Groups</div>
          <!-- If there are no groups show message to create one -->
          <div v-if="!groupsManage.length">
            <q-btn
              to="/group/create"
              no-caps
              flat
              align="left"
              class="full-width"
              color="primary"
              icon="las la-plus-circle"
              label="Create a group"
            />
          </div>

          <!-- List of Groups -->
          <q-virtual-scroll
            :items="groupsManage"
            virtual-scroll-horizontal
            class="hide-scrollbar"
          >
            <template v-slot="{ item, index }">
              <div class="q-pa-sm" :key="index" :class="item.class">
                <q-avatar
                  @click="$router.push('/group/' + item.id)"
                  size="60px"
                >
                  <img :src="item.photoURL" alt="Group Avatar" />
                </q-avatar>
              </div>
            </template>
          </q-virtual-scroll>
        </q-card-section>

        <!-- Contacts , Social Links-->
        <q-card-section class="q-py-none">
          <div class="text-subtitle1 text-bold">Social Links</div>
          <!-- If user no social links added show this message -->
          <div
            v-if="!authUser.social_links"
            class="text-body2 text-grey text-center"
          >
            <q-icon click="q-mr-md" name="fas fa-plus" />
            <span>Add some links...</span>
          </div>

          <!-- List of Social Links -->
          <q-list dense>
            <q-item
              v-for="link in authUser.social_links"
              :key="link.platform"
              clickable
            >
              <q-item-section avatar>
                <q-icon
                  class="text-primary"
                  size="xs"
                  :name="'ti-' + link.platform.toLowerCase()"
                />
              </q-item-section>
              <q-item-section @click="openLink(link)">{{
                link.username
              }}</q-item-section>
              <q-item-section side>
                <q-btn
                  @click="deleteSocialLink(link)"
                  flat
                  round
                  size="xs"
                  icon="ti-close"
                />
              </q-item-section>
            </q-item>
          </q-list>

          <!-- Adding Social Links and Contacts -->
          <div class="q-pa-md q-gutter-y-md">
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
              <div class="q-gutter-y-sm" v-if="social_links.platform">
                <q-input
                  v-model="social_links.username"
                  dense
                  outlined
                  placeholder="Username"
                />
                <div class="text-right">
                  <q-btn
                    @click="saveSocialLink"
                    class="text-bold"
                    :disable="!social_links.username"
                    rounded
                    unelevated
                    dense
                    no-caps
                    label="Save"
                  />
                </div>
              </div>
            </transition>
          </div>
        </q-card-section>
      </q-card>
    </transition>

    <!--
      DIALOGS
      -->
    <!-- Edit Profile dialog -->
    <q-dialog
      v-model="editDialog"
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <q-toolbar class="text-dark">
          <q-btn v-close-popup no-caps flat icon="arrow_back" />
        </q-toolbar>
        <!-- Avatar Section -->
        <q-card-section class="flex flex-center">
          <input
            type="file"
            ref="fileInput"
            style="display: none"
            @change="uploadFile"
            accept="image/*"
          />
          <q-avatar
            @click="$refs.fileInput.click()"
            size="100px"
            font-size="52px"
            color="grey-4"
          >
            <q-icon
              v-show="!authUser.photoURL && !croppedImage"
              name="fas fa-camera"
            />
            <img
              class="group-avatar"
              v-show="authUser.photoURL && !croppedImage"
              :src="authUser.photoURL"
            />
            <img
              class="group-avatar"
              v-if="croppedImage"
              :src="croppedImage.toDataURL()"
            />
          </q-avatar>
        </q-card-section>

        <q-card-section>
          <!-- Textfields -->
          <div class="text-subtitle1 text-bold">Basic Info</div>
          <div class="q-gutter-y-md">
            <q-input v-model="user.displayName" label="Name" />
            <q-input v-model="user.email" type="email" label="Email" />
            <q-input
              outlined
              v-model="user.bio"
              type="textarea"
              counter
              maxlength="101"
              placeholder="Say something about yourself..."
            />
          </div>
          <div class="text-subtitle1 text-bold">Address</div>
          <q-input v-model="user.address" outlined label="Address" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn class="text-bold" v-close-popup no-caps flat label="Cancel" />
          <q-btn
            class="text-bold"
            @click="saveProfile"
            v-close-popup
            :disable="disableUpdate"
            flat
            rounded
            no-caps
            label="Save"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Loading design -->
    <q-inner-loading :showing="loading">
      <q-spinner-ball size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>
<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeMount } from "vue";
import { useQuasar } from "quasar";
// Import Composables
import { useImageUpload } from "src/composables/image-upload";
// Import Components
import ConfirmAuth from "src/components/ConfirmAuth.vue";
import AvatarCropper from "src/components/dialogs/AvatarCropper.vue";

// Import Stores
import { useAuthStore } from "src/stores/auth";
import { useUserStore } from "src/stores/users";
import { useGroupStore } from "src/stores/groups";
//Define Stores
const authStore = useAuthStore(),
  groupStore = useGroupStore(),
  userStore = useUserStore();

const $q = useQuasar();
const authUser = computed(() => authStore.getAuthProfile);

//Add Social Links
const social_links = reactive({
  platform: "",
  username: "",
});
const platforms = ["Facebook", "Twitter", "Instagram", "LinkedIn", "Youtube"];
const addLink = (platform) => {
  social_links.platform = platform;
};
const saveSocialLink = () => {
  userStore.updateUserProfile({ link: social_links });
};
const openLink = (link) => {
  let url = "https://" + link.platform.toLowerCase() + ".com/";
  openURL(url + link.username);
};
// Delete Social Link
const deleteSocialLink = (link) => {
  userStore.updateUserProfile({ delete: true, link: link });
};

// Editing Profile
const editDialog = ref(false),
  disableUpdate = ref(true);
const user = reactive({
  displayName: "",
  photo: {
    src: "",
    type: "",
  },
  email: "",
  password: "",
  bio: "",
  address: "",
});
// Watch changes on the input fields
watch(user, () => {
  disableUpdate.value = false;
});
const editingMode = (authUser) => {
  user.displayName = authUser.displayName;
  user.email = authUser.email;
  user.bio = authUser.bio ? authUser.bio : "";
  user.address = authUser.address ? authUser.address : "";
  editDialog.value = true;
};
const saveProfile = async () => {
  if (user.email !== authUser.value.email) {
    // confirmDialog.value = true;
    $q.dialog({
      component: ConfirmAuth,
      componentProps: {
        user: user,
      },
    });
    return;
  }
  if (croppedImage.value) {
    const canvas = croppedImage.value;
    canvas.toBlob(async (blob) => {
      user.photo.src = await blob;
      await userStore.updateUserProfile(user);
    }, image.type);
  } else {
    await userStore.updateUserProfile(user);
  }
};

// Reauthentication for Sensitve Updates
const confirmDialog = ref(false);
const confirmDetails = reactive({
  email: "",
  password: "",
});
const confirmdUpdate = () => {
  authStore.reAuthenticateUser({
    credential: confirmDetails,
    newDetails: user,
  });
  confirmDialog.value = false;
};

// Get Groups Manage
const groupsManage = computed(() => groupStore.groupsManage);
onBeforeMount(() => {
  groupStore.getGroupsManage();
});

/*
  Upload and Cropped Image
  ********************
  ********************
*/
const { getMimeType } = useImageUpload();
const fileInput = ref();
const image = reactive({
  src: "",
  type: "",
});
const croppedImage = ref();
watch(image, () => {
  openCropper();
});
const openCropper = () => {
  $q.dialog({
    component: AvatarCropper,
    componentProps: {
      imageFile: image,
    },
  }).onOk((result) => {
    croppedImage.value = result;
    user.photo.type = image.type;
  });
  fileInput.value = "";
};
const uploadFile = (event) => {
  const { files } = event.target;
  const allowedExtension = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/bmp",
  ];
  if (files && files[0]) {
    if (allowedExtension.indexOf(files[0].type) > -1) {
      // Revoke the object URL
      const blob = URL.createObjectURL(files[0]);
      const reader = new FileReader();
      reader.onload = (e) => {
        image.src = blob;
        image.type = getMimeType(e.target.result, files[0].type);
      };
      reader.readAsArrayBuffer(files[0]);
    } else {
      $q.dialog({
        title: "We're sorry",
        message: "The file type is not allowed.",
      });
    }
  }
};
/*
  Upload and Cropped Image
  ********************
  ********************
*/

//Loading State
const loading = ref(true);
const showLoading = () => {
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};

onMounted(() => {
  showLoading();
});
</script>

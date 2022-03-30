<q-item>
            <q-item-section avatar>
              <q-avatar size="60px" v-if="notif.from.photoURL">
                <img :src="notif.from.photoURL" alt="Avatar" />
              </q-avatar>
              <q-avatar
                size="60px"
                v-else
                color="primary"
                text-color="white"
                class="text-bold"
                >{{ notif.from.displayName[0].toUpperCase() }}</q-avatar
              >
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle2">
                {{ notif.from.displayName }}
              </q-item-label>

              <q-item-label caption>
                {{ relativeDate(notif.createdAt) }}
              </q-item-label>
              <q-item-label
                @click="$router.push('/group/' + notif.groupId)"
                :class="notif.unread ? 'text-white' : ''"
              >
                <span v-show="notif.type == 'group-invite'"
                  >you are invited to join in
                </span>
                <span v-show="notif.type == 'group-update'"
                  >posted a new update in
                </span>
                <span class="text-primary">{{ notif.group.name }}</span>
              </q-item-label>
            </q-item-section>

            <q-item-section side top :class="notif.viewed ? 'text-white' : ''">
              <q-icon name="las la-ellipsis-h" />
            </q-item-section>
          </q-item>

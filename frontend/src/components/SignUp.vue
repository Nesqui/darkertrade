<script setup lang="ts">
import { ElNotification, FormInstance, FormRules } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { onBeforeMount, onMounted, reactive, ref } from 'vue'
import { initAuthApi, initUserApi, UpdateUserDto, User } from '@/hooks'
import bcrypt from 'bcryptjs'
import { useUserStore } from '~/store';

const bannedWords = ["test", "item", "user", "market", "nigger", "about", "abuse", "access", "account", "accounts", "activate", "ad", "add", "address", "adm", "admin", "administration", "administrator", "ads", "adult", "advertising", "affiliate", "affiliates", "ajax", "analytics", "android", "anon", "anonymous", "api", "app", "apps", "archive", "atom", "auth", "authentication", "autoconfig", "avatar", "backup", "bad", "banner", "banners", "best", "beta", "billing", "bin", "blackberry", "blog", "blogs", "board", "bot", "bots", "broadcasthost", "business", "cache", "calendar", "campaign", "career", "careers", "cart", "cdn", "cgi", "chat", "chef", "client", "clients", "code", "codes", "commercial", "community", "compare", "config", "connect", "contact", "contest", "cookie", "copyright", "corporate", "create", "crossdomain", "css", "customer", "dash", "dashboard", "data", "database", "db", "delete", "demo", "design", "designer", "dev", "devel", "developer", "developers", "development", "dir", "directory", "dmca", "doc", "docs", "documentation", "domain", "domainadmin", "domainadministrator", "download", "downloads", "ecommerce", "edit", "editor", "email", "embed", "enterprise", "error", "errors", "events", "example", "facebook", "faq", "faqs", "favorite", "favorites", "favourite", "favourites", "features", "feed", "feedback", "feeds", "file", "files", "follow", "font", "fonts", "forum", "forums", "free", "ftp", "gadget", "gadgets", "games", "gift", "git", "good", "google", "group", "groups", "guest", "guests", "help", "helpcenter", "home", "homepage", "host", "hosting", "hostmaster", "hostname", "html", "http", "httpd", "https", "image", "images", "imap", "img", "index", "indice", "info", "information", "intranet", "invite", "ipad", "iphone", "irc", "is", "isatap", "it", "java", "javascript", "job", "jobs", "js", "json", "knowledgebase", "legal", "license", "list", "lists", "localdomain", "localhost", "log", "login", "logout", "logs", "mail", "mailerdaemon", "manager", "manifesto", "marketing", "master", "me", "media", "message", "messages", "messenger", "mine", "mis", "mob", "mobile", "msg", "must", "mx", "my", "mysql", "name", "named", "net", "network", "new", "newest", "news", "newsletter", "nobody", "noc", "nogroup", "noreply", "notes", "ns", "ns1", "ns2", "ns3", "ns4", "ns5", "ns6", "ns7", "ns8", "ns9", "oembed", "old", "oldest", "online", "operator", "order", "orders", "owner", "page", "pager", "pages", "panel", "password", "perl", "photo", "photos", "php", "pic", "pics", "plan", "plans", "plugin", "plugins", "pop", "pop3", "post", "postfix", "postmaster", "posts", "press", "pricing", "privacy", "profile", "project", "projects", "promo", "pub", "public", "python", "random", "recipe", "recipes", "register", "registration", "remove", "request", "reset", "robots", "root", "rss", "ruby", "sale", "sales", "sample", "samples", "save", "script", "scripts", "search", "secure", "security", "send", "service", "services", "setting", "settings", "setup", "shop", "shopping", "signin", "signout", "signup", "site", "sitemap", "sites", "smtp", "sql", "src", "ssh", "ssl", "ssladmin", "ssladministrator", "sslwebmaster", "stage", "staging", "start", "stat", "static", "stats", "status", "store", "stores", "subdomain", "subscribe", "support", "surprise", "svn", "sys", "sysadmin", "sysop", "system", "tablet", "tablets", "talk", "task", "tasks", "tech", "telnet", "terms", "test", "test1", "test2", "test3", "tests", "theme", "themes", "tmp", "todo", "tools", "top", "trust", "tutorial", "tutorials", "tv", "twitter", "twittr", "unsubscribe", "update", "upload", "url", "usage", "usenet", "user", "username", "users", "uucp", "video", "videos", "visitor", "web", "weblog", "webmail", "webmaster", "website", "websites", "welcome", "wiki", "win", "wpad", "ww", "wws", "www", "www1", "www2", "www3", "www4", "www5", "www6", "www7", "wwws", "wwww", "xml", "xpg", "xxx", "yahoo", "you", "yourdomain", "yourname", "yoursite", "yourusername"]

const regeXnickname = new RegExp(/^[a-zA-Z0-9]+$/)
const regeXpass = new RegExp(/^[a-zA-Z0-9.,!@*]+$/)
const route = useRoute()
const hash = ref()
const userApi = initUserApi()
const user = ref<User>()
const salt = `$2a$10$J6lL9ugC5/geb6KF8MNIKu`
const loading = ref(false)
const authApi = initAuthApi()
const userStore = useUserStore()
const router = useRouter()
const emit = defineEmits(['userCreated'])

interface RegistrationForm {
  nickname: string,
  password: string,
  discord: string,
  confirmPassword: string
}
const ruleFormRef = ref<FormInstance>()

const validatePass = (rule: any, value: any, callback: any) => {
  if (value.length < 3 || value.length > 16) {
    callback(new Error('Password has to be between 3 and 16 characters'))
  } else if (value === '') {
    callback(new Error('Cannot be empty'))
  } else if (!regeXpass.test(value)) {
    callback(new Error('Allowed special chars are . , ! @ * '))
  } else {
    callback()
  }
}

const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the password again'))
  } else if (value !== form.password) {
    callback(new Error("Mismatch of password"))
  } else {
    callback()
  }
}

const validateUsername = (rule: any, value: any, callback: any) => {
  if (bannedWords.includes(value.toLowerCase())) {
    callback(new Error('disallowed username'))
  }
  if (value === '') {
    callback(new Error('Username cannot be empty'))
  } else if (value.length < 3 || value.length > 16) {
    callback(new Error('Username has to be between 3 and 16 characters'))
  } else if (!regeXnickname.test(value)) {
    callback(new Error('Latin letters and numbers'))
  } else {
    callback()
  }
}

const login = async (user: UpdateUserDto) => {
  loading.value = true
  try {
    const hashPass = bcrypt.hashSync(user.password, salt);
    const a = await authApi.signIn({
      nickname: user.nickname.toLowerCase().trim(),
      password: hashPass
    })
    if (!a) throw new Error()

    userStore.saveUser(a.user)
    userStore.saveToken(a.jwtToken)
    router.push('/')
  } catch (error) {
    ElNotification({
      message: "Login or password wrong"
    })
  } finally {
    loading.value = false
  }
}


const rules = reactive<FormRules>({
  nickname: [
    {
      validator: validateUsername,
      required: true,
      trigger: 'change',
    }
  ],
  password: [
    {
      validator: validatePass,
      required: true,
      trigger: 'blur',
    },
  ],
  confirmPassword: [
    {
      validator: validatePass2,
      required: true,
      trigger: 'blur',
    },
  ],
})

const form = reactive<RegistrationForm>({
  nickname: "",
  password: "",
  discord: "",
  confirmPassword: ""
})

const signUp = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        loading.value = true
        const hashPass = bcrypt.hashSync(form.password, salt);
        const data = { hash: hash.value, nickname: form.nickname.toLowerCase().trim(), password: hashPass }
        const res = await userApi.update(data)
        if (res)
        ElNotification({
          message: 'User created'
        })
        emit("userCreated", data)
      } catch (error) {
      } finally {
        loading.value = false
      }
    } else {
      ElNotification({
        message: 'Inputs has invalid values'
      })
    }
  })
}

onBeforeMount(async () => {
  if (route.query.hash) {
    hash.value = route.query.hash
    user.value = await userApi.findOneByHash(hash.value)
    if (!user.value) {
      ElNotification({
        message: 'This token already used, try auth again via discord'
      })
      router.push('/signup')
      hash.value = null
    }
  }
})

const env = ref(import.meta.env.VITE_ENV)

</script>

<template>
  <el-form v-if="!hash" ref="ruleFormRef" status-icon>
    <p>TaT requires a signup link generated by bot with your Discord.
    </p>
    <p>
      Use the /registration command in our server to proceed with registration.
    </p>
    <div class="register-discord">
      <a class="tat-frame" :href="env === 'production' ? 'https://discord.gg/VT6grnfD6t' : 'https://discord.gg/rD9bgctHNr'">
        <svg width="70px" height="70px" viewBox="0 -28.5 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid">
          <g>
            <path fill="#C69749"
              d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z">
            </path>
          </g>
        </svg>
        Signup via discord
      </a>
    </div>
  </el-form>
  <el-form v-else ref="ruleFormRef" :model="form" :rules="rules" status-icon>
    <div class="register">
      <el-form-item prop="nickname">
        <el-input readonly onfocus="this.removeAttribute('readonly');" :placeholder="user?.nickname ? `nickname (${user.nickname})` : 'nickname'"
          v-model="form.nickname"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input readonly onfocus="this.removeAttribute('readonly');" type="password" v-model="form.password"
          placeholder="Password"></el-input>
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <el-input readonly onfocus="this.removeAttribute('readonly');" type="password" v-model="form.confirmPassword"
          placeholder="Confirm password"></el-input>
      </el-form-item>
      <el-button :disabled="loading" @click="signUp(ruleFormRef)">Signup</el-button>
    </div>
  </el-form>
</template>

<style scoped lang="scss">
p {
  text-align: left;
}


.register-discord {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 1.35rem;
  width: 300px;

  .el-button {
    margin: 1rem 0 2rem 0;
  }

  a:hover {
    transform: scale(1.05);
  }

  a {
    margin-top: .35rem;
    transition: .5s all;
    display: flex;
    align-items: center;
    gap: 1rem;
    color: var(--color-text);
    text-decoration: unset;
    padding: 1rem 2rem;
    font-size: 16px;
  }


  .el-form-item {
    margin-bottom: 0;
  }
}

.register {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
  width: 300px;

  .el-button {
    margin: 1rem 0 2rem 0;
  }

  .el-form-item {
    margin-bottom: 0;
  }
}
</style>
<style lang="scss">
.register {
  .el-form-item__error {
    position: absolute;
    line-height: unset;
    padding-top: 1px;
  }
}
</style>
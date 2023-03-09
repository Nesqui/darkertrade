<script setup lang="ts">
import { FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'

const pidarov = ["test", "item", "user", "market", "nigger", "about", "abuse", "access", "account", "accounts", "activate", "ad", "add", "address", "adm", "admin", "administration", "administrator", "ads", "adult", "advertising", "affiliate", "affiliates", "ajax", "analytics", "android", "anon", "anonymous", "api", "app", "apps", "archive", "atom", "auth", "authentication", "autoconfig", "avatar", "backup", "bad", "banner", "banners", "best", "beta", "billing", "bin", "blackberry", "blog", "blogs", "board", "bot", "bots", "broadcasthost", "business", "cache", "calendar", "campaign", "career", "careers", "cart", "cdn", "cgi", "chat", "chef", "client", "clients", "code", "codes", "commercial", "community", "compare", "config", "connect", "contact", "contest", "cookie", "copyright", "corporate", "create", "crossdomain", "css", "customer", "dash", "dashboard", "data", "database", "db", "delete", "demo", "design", "designer", "dev", "devel", "developer", "developers", "development", "dir", "directory", "dmca", "doc", "docs", "documentation", "domain", "domainadmin", "domainadministrator", "download", "downloads", "ecommerce", "edit", "editor", "email", "embed", "enterprise", "error", "errors", "events", "example", "facebook", "faq", "faqs", "favorite", "favorites", "favourite", "favourites", "features", "feed", "feedback", "feeds", "file", "files", "follow", "font", "fonts", "forum", "forums", "free", "ftp", "gadget", "gadgets", "games", "gift", "git", "good", "google", "group", "groups", "guest", "guests", "help", "helpcenter", "home", "homepage", "host", "hosting", "hostmaster", "hostname", "html", "http", "httpd", "https", "image", "images", "imap", "img", "index", "indice", "info", "information", "intranet", "invite", "ipad", "iphone", "irc", "is", "isatap", "it", "java", "javascript", "job", "jobs", "js", "json", "knowledgebase", "legal", "license", "list", "lists", "localdomain", "localhost", "log", "login", "logout", "logs", "mail", "mailerdaemon", "manager", "manifesto", "marketing", "master", "me", "media", "message", "messages", "messenger", "mine", "mis", "mob", "mobile", "msg", "must", "mx", "my", "mysql", "name", "named", "net", "network", "new", "newest", "news", "newsletter", "nobody", "noc", "nogroup", "noreply", "notes", "ns", "ns1", "ns2", "ns3", "ns4", "ns5", "ns6", "ns7", "ns8", "ns9", "oembed", "old", "oldest", "online", "operator", "order", "orders", "owner", "page", "pager", "pages", "panel", "password", "perl", "photo", "photos", "php", "pic", "pics", "plan", "plans", "plugin", "plugins", "pop", "pop3", "post", "postfix", "postmaster", "posts", "press", "pricing", "privacy", "profile", "project", "projects", "promo", "pub", "public", "python", "random", "recipe", "recipes", "register", "registration", "remove", "request", "reset", "robots", "root", "rss", "ruby", "sale", "sales", "sample", "samples", "save", "script", "scripts", "search", "secure", "security", "send", "service", "services", "setting", "settings", "setup", "shop", "shopping", "signin", "signout", "signup", "site", "sitemap", "sites", "smtp", "sql", "src", "ssh", "ssl", "ssladmin", "ssladministrator", "sslwebmaster", "stage", "staging", "start", "stat", "static", "stats", "status", "store", "stores", "subdomain", "subscribe", "support", "surprise", "svn", "sys", "sysadmin", "sysop", "system", "tablet", "tablets", "talk", "task", "tasks", "tech", "telnet", "terms", "test", "test1", "test2", "test3", "tests", "theme", "themes", "tmp", "todo", "tools", "top", "trust", "tutorial", "tutorials", "tv", "twitter", "twittr", "unsubscribe", "update", "upload", "url", "usage", "usenet", "user", "username", "users", "uucp", "video", "videos", "visitor", "web", "weblog", "webmail", "webmaster", "website", "websites", "welcome", "wiki", "win", "wpad", "ww", "wws", "www", "www1", "www2", "www3", "www4", "www5", "www6", "www7", "wwws", "wwww", "xml", "xpg", "xxx", "yahoo", "you", "yourdomain", "yourname", "yoursite", "yourusername"]

const regeXnickname = new RegExp(/^[a-zA-Z0-9]+$/)
const regeXpass = new RegExp(/^[a-zA-Z0-9.,!@*]+$/)
const regeXdisc = new RegExp(/^[a-zA-Z0-9\s]+#[0-9]{4}$/)

interface RegistrationForm {
    nickname: string,
    password: string,
    discord: string,
    confirmPassword: string
}
const ruleFormRef = ref<FormInstance>()

const validatePass = (rule: any, value: any, callback: any) => {
    if (value.length < 4 || value.length > 16) {
        callback(new Error('Password has to be between 4 and 16 characters'))
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

const validateDisc = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('Copy-paste your discord here'))
    } else if (!regeXdisc.test(value)) {
        callback(new Error('Copy-paste your discord here'))
    } else {
        callback()
    }
}

const validateUsername = (rule: any, value: any, callback: any) => {
    if (pidarov.includes(value.toLowerCase())) {
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
    discord: [
        {
            validator: validateDisc,
            required: true,
            trigger: 'change',
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
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log('submit!')
        } else {
            console.log('error submit!', fields)
        }
    })
}
</script>

<template>
    <el-form ref="ruleFormRef" :model="form" :rules="rules" status-icon>
        <div class="register">
            <el-form-item prop="nickname">
                <el-input v-model="form.nickname" placeholder="Login"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input v-model="form.password" placeholder="Password"></el-input>
            </el-form-item>
            <el-form-item prop="confirmPassword">
                <el-input v-model="form.confirmPassword" placeholder="Confirm password"></el-input>
            </el-form-item>
            <el-form-item prop="discord">
                <el-input v-model="form.discord" placeholder="Discord"></el-input>
            </el-form-item>
            <el-button @click="signUp(ruleFormRef)">Signup</el-button>
        </div>
    </el-form>
</template>

<style scoped lang="scss">
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
        // top: unset;
        // left: unset;
    }
}
</style>
import {
  SiForgejo,
  SiJellyfin,
  SiOllama,
  SiVaultwarden,
} from "react-icons/si"
import {
  TbBrowser,
  TbDeviceTv,
  TbGitBranch,
  TbKey,
  TbLink,
  TbLock,
  TbMail,
  TbServer,
  TbUser,
  TbUserPlus,
} from "react-icons/tb"

export interface Service {
  name: string;
  description: string;
  icon: React.ElementType;
  priceStatus: "open" | "invite-only" | "by-request"; /*
  open -> open, public registration
  invite-only -> manual registration/invites
  by-request -> must be requested by user */
  adminView: Record<string, {
    icon: React.ElementType;
    description: string;
  }>;
}

export const services = [
  {
    name: "git",
    description: "Easy-to-use git server w/ Actions support. Powered by Forgejo.",
    icon: SiForgejo,
    priceStatus: "open",
    joinLink: "https://git.p0ntus.com",
    adminView: {
      "Your private repositories": {
        icon: TbGitBranch,
        description: "Your private repositories are visible to admins.",
      },
      "Your email address": {
        icon: TbMail,
        description: "Your email address is visible to admins.",
      },
      "Change your password": {
        icon: TbLock,
        description: "Your password can be changed by an admin. It is not visible.",
      },
    },
    quickLinks: [
      {
        name: "Create an Account",
        url: "https://git.p0ntus.com/user/sign_up",
        icon: TbUserPlus,
      },
      {
        name: "Login",
        url: "https://git.p0ntus.com/user/login",
        icon: TbUser,
      },
      {
        name: "Forgot Password",
        url: "https://git.p0ntus.com/user/forgot_password",
        icon: TbLock,
      },
    ]
  },
  {
    name: "tv",
    description: "Private screening movies and TV shows. Powered by Jellyfin.",
    icon: SiJellyfin,
    priceStatus: "invite-only",
    adminView: {
      "Your devices": {
        icon: TbDeviceTv,
        description: "Your devices and their IP addresses.",
      },
      "Your email address": {
        icon: TbMail,
        description: "Your email address is visible to admins.",
      },
      "The content you watch": {
        icon: TbUser,
        description: "The content you watch is visible to admins.",
      },
      "Change settings and preferences": {
        icon: TbKey,
        description: "Admins can change settings and preferences.",
      },
    }
  },
  {
    name: "ai",
    description: "Invite-only Open WebUI instance w/ Ollama and popular models.",
    icon: SiOllama,
    priceStatus: "invite-only",
    adminView: {
      "Your email address": {
        icon: TbMail,
        description: "Your email address is visible to admins.",
      },
    }
  },
  /*{
    name: "keybox",
    description: "Need integrity? We do our best to provide you STRONG",
    icon: TbKey,
    priceStatus: "open",
    joinLink: "/keybox",
    adminView: {
      "Your email address": {
        icon: TbMail,
        description: "Your email address is visible to admins.",
      },
      "Your sessions": {
        icon: TbBrowser,
        description: "Your sessions are visible to admins.",
      },
      "Your connections": {
        icon: TbLink,
        description: "If you authenticate with SSO, your connections are visible to admins.",
      },
    }
  },*/
  {
    name: "mail",
    description: "A private mail server with full data control. Powered by Mailu.",
    icon: TbMail,
    priceStatus: "open",
    joinLink: "https://pontusmail.org",
    adminView: {
      "Change user settings": {
        icon: TbUser,
        description: "Admins can change and view user settings.",
      },
      "Subject lines": {
        icon: TbMail,
        description: "Subject lines are visible to admins.",
      },
      "Your email address": {
        icon: TbMail,
        description: "Your email address is visible to admins.",
      },
    },
    quickLinks: [
      {
        name: "Create an Account",
        url: "https://pontusmail.org/admin/user/signup",
        icon: TbUserPlus,
      },
      {
        name: "Login",
        url: "https://pontusmail.org/sso/login",
        icon: TbUser,
      },
      {
        name: "Server Details",
        url: "https://pontusmail.org/admin/client",
        icon: TbServer,
      },
    ]
  },
  {
    name: "hosting",
    description: "By-request server and service hosting.",
    icon: TbServer,
    priceStatus: "by-request",
    joinLink: "https://pass.librecloud.cc",
    adminView: {
      "Your data": {
        icon: TbServer,
        description: "Your instance data is visible to admins.",
      },
      "Your email address": {
        icon: TbMail,
        description: "Your email address is visible to admins.",
      },
      "Your connections": {
        icon: TbLink,
        description: "If you authenticate with SSO, your connections are visible to admins.",
      },
      "Your sessions": {
        icon: TbBrowser,
        description: "Your sessions are visible to admins.",
      },
    }
  },
  {
    name: "pass",
    description: "A private password manager. Powered by Vaultwarden.",
    icon: SiVaultwarden,
    priceStatus: "open",
    joinLink: "https://pass.librecloud.cc",
    adminView: {
      "Your total entry count": {
        icon: TbServer,
        description: "Admins can view how many passwords you have stored.",
      },
      "Your email address": {
        icon: TbMail,
        description: "Your email address is visible to admins.",
      },
      "Your organizations": {
        icon: TbLink,
        description: "If you create an organization, admins can view basic details.",
      },
    },
    quickLinks: [
      {
        name: "Create an Account",
        url: "https://pass.librecloud.cc/#/signup",
        icon: TbUserPlus,
      },
      {
        name: "Login",
        url: "https://pass.librecloud.cc/#/login",
        icon: TbUser,
      },
      {
        name: "Login with Passkey",
        url: "https://pass.librecloud.cc/#/login-with-passkey",
        icon: TbKey,
      },
    ]
  },
]
type DiscordNotifyType = ['BidCreated'];

export default DiscordNotifyType;

export default interface DiscordNotify {
  type: DiscordNotifyType;
  message: string;
}

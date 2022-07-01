export type LinkingFlow = {
  name: string
  icon?: string
  displayName?: string
  verification?: string
  description: {
    text: string
    header?: string
  }
  colors: {
    primary: string
    secondary?: string
    buttonColor?: string
    primaryFontColor?: string
    secondaryFontColor?: string
  }
}

export const linkingFlows: { [key: string]: LinkingFlow } = {
  default: {
    name: 'default',
    displayName: 'Social Media',
    description: {
      header: 'Verify your social media accounts',
      text: 'Link your social media',
    },
    colors: {
      primary: '#1a1b20',
      secondary: '#26272b',
    },
  },
  twitter: {
    name: 'twitter',
    icon: './icons/twitter-icon.png',
    displayName: 'Twitter',
    verification: 'Tweet',
    description: {
      header: 'Tweet!',
      text: 'Tweet your public key',
    },
    colors: {
      primary: '#1da1f2',
      secondary: '#FFFFFF',
      buttonColor: '#f0f1f3',
      primaryFontColor: '#ffffff',
      secondaryFontColor: '#697b89',
    },
  },
  discord: {
    name: 'discord',
    icon: './icons/discord-icon.png',
    displayName: 'Discord',
    verification: 'Verification',
    description: {
      header: 'OAuth',
      text: 'Connect your Discord account',
    },
    colors: {
      primary: '#5866f2',
      secondary: '#36393e',
      buttonColor: '#4f545b',
      primaryFontColor: '#ffffff',
    },
  },
}
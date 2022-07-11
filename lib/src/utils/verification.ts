export const handleFromTweetUrl = (
  raw: string | undefined
): string | undefined => {
  if (!raw) return undefined
  return raw.split('/')[3]
}

export const tweetIdFromUrl = (raw: string | undefined): string | undefined => {
  if (!raw) return undefined
  return raw.split('/')[5]?.split('?')[0]
}

export const discordCodeFromUrl = (raw: string | undefined): string | null => {
  if (!raw) return null
  const urlParams = new URLSearchParams(raw)
  return urlParams.get('code')
}

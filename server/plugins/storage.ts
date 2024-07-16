import vercelKVDriver from "unstorage/drivers/vercel-kv"

export default defineNitroPlugin(() => {
  const storage = useStorage()

  const driver = vercelKVDriver({

  })
})

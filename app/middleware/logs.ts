export default defineEventHandler((event) => {
  console.log(`${event.method.toUpperCase()}: ` + getRequestURL(event))
})

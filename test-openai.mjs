import OpenAI from 'openai'

async function main(){
  const apiKey = process.env.OPENAI_API_KEY
  if(!apiKey){
    console.error('OPENAI_API_KEY not set in environment. Add it to .env.local or set $env:OPENAI_API_KEY for this shell.')
    process.exit(1)
  }

  const client = new OpenAI({ apiKey })
  try{
    const res = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Say hello in one short sentence.' }],
    })
    console.log('OK: got response')
    console.log(JSON.stringify(res.choices?.[0]?.message?.content ?? res, null, 2))
  }catch(e){
    console.error('OpenAI error:')
    console.error(e)
    process.exit(1)
  }
}

main()

import GameCanvas from '@/components/GameCanvas'
import Image from 'next/image'

export default function Home() {
  return (
    <main className='flex flex-col justify-center items-center m-6'>
      <div className='text-5xl my-5'>
        UnderSiege
      </div>
        <GameCanvas />
    </main>
  )
}

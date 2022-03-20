import Logo from '@/components/svg/Logo'
import Link from 'next/link'

const OpenEditorButton = () => {
  return (
    <button className='btn btn-blue'>
      <Link href={'/editor'} passHref>
        <a>Open Editor</a>
      </Link>
    </button>
  )
}

function Landing() {
  return (
    <div className='flex justify-evenly flex-col items-center min-h-full py-32'>
      <Logo className='fill-slate-200' />
      <OpenEditorButton />
    </div>
  )
}

export default Landing

import Landing from '@/components/site/Landing/Landing'

const Page = () => {
  return <Landing />
}

export default Page

export async function getStaticProps() {
  return {
    props: {
      title: 'Band',
    },
  }
}

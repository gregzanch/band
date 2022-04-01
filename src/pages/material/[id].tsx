import React from "react"
import { GetServerSideProps } from "next"

function Material(props) {
  return <pre>{JSON.stringify(props, undefined, 2)}</pre>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const ENV = process.env.NEXT_PUBLIC_VERCEL_ENV
  const isLocal = process.env.NEXT_PUBLIC_VERCEL_URL.startsWith("localhost")
  const baseUrl = isLocal
    ? `http://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  try {
    const res = await fetch(`${baseUrl}/api/materials/${context.params.id}`)
    const data = await res.json()
    return { props: { ...data, title: "Material" } }
  } catch (error) {
    return {
      props: {
        title: "Material",
        error: error.message,
      },
    }
  }
}

export default Material

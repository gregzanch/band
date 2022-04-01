import React from "react"
import { GetServerSideProps } from "next"

function Material(props) {
  return <pre>{JSON.stringify(props, undefined, 2)}</pre>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/materials/${context.params.id}`)
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

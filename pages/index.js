import React, { useState, useEffect, useRef } from 'react'
import { Replicache } from 'replicache'
import { useSubscribe } from 'replicache-react-util'
import { v4 as uuidv4 } from 'uuid'

export default function Home() {
  const [rep, setRep] = useState(null)

  useEffect(async () => {
    const rep = new Replicache({
      pushURL: '/api/replicache-push',
      pullURL: '/api/replicache-pull',
      mutators: {
        async createPost(tx, {id, from, content, order, labels}) {
          await tx.put(`post/${id}`, {
            from,
            content,
            order, 
            labels
          })
        }
      },
      wasmModule: '/replicache.dev.wasm',
    })
    listen(rep)
    setRep(rep)
    console.log('rep', rep)
    console.log('uuid', uuidv4())
  }, [])

  return rep && <Library rep={rep} />
}

function Library({rep}) {
  const posts = useSubscribe(
    rep,
    async tx => {
      const list = await tx.scan({prefix: 'post/'}).entries().toArray()
      list.sort(([, {order: a}], [, {order: b}]) => a - b)
      console.log('list', list)
      return list
    },
    []
  )

  const usernameRef = useRef()
  const contentRef = useRef()

  const onSubmit = e => {
    e.preventDefault()
    console.log("i am in onsubmit")
    const last = posts.length && posts[posts.length - 1][1]
    const order = (last?.order ?? 0) + 1
    rep.mutate.createPost({
      id: uuidv4(),
      from: usernameRef.current.value,
      content: contentRef.current.value,
      order,
      labels: [
        { 
          id: uuidv4(),
          name: 'important',
          color: 'red'
        },
      ]
    })
    usernameRef.current.value = ''
    contentRef.current.value = ''
  }

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={onSubmit}>
        <input ref={usernameRef} style={styles.username} required />
        says:
        <input ref={contentRef} style={styles.content} required />
        <input type="submit" />
      </form>
      <PostList posts={posts} />
    </div>
  )
}

function PostList({posts}) {
  return posts.map(([k, v]) => {
    return (
      <div key={k} style={styles.post}>
        <b>{v.from}: </b>
        {v.content}
        {v.labels[0].name}
      </div>
    )
  })
}

function listen(rep){
  // TODO: Listen for changes on server
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '-apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif,Apple Color Emoji',
  },
  form: {
    display: 'flex',
    flexDirection: 'row',
    flex: 0,
    marginBottom: '1em',
  },
  post: {
    marginBottom: '1em',
  },
  username: {
    flex: 0,
    marginRight: '1em',
    maxWidth: '5em',
  },
  content: {
    flex: 1,
    maxWidth: '12em',
    margin: '0 1em',
  },
}

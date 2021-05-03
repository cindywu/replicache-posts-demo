import { getDB } from '../../db.js'

export default async (_, res) => {
  const db = await getDB()
  await db.task(async t => {
    await t.none('DROP TABLE IF EXISTS posts')
    await t.none('DROP TABLE IF EXISTS replicache_client')
    await t.none('DROP SEQUENCE IF EXISTS version')

    await t.none(`CREATE TABLE post (
      id VARCHAR(20) PRIMARY KEY NOT NULL,
      sender VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      ord BIGINT NOT NULL,
      labels JSONB,
      version BIGINT NOT NULL)`)
    await t.none(`CREATE TABLE replicache_client(
      id VARCHAR(36) PRIMARY KEY NOT NULL,
      last_mutation_id BIGINT NOT NULL)`)
    await t.none('CREATE SEQUENCE version')
  })
  res.send('ok')
}
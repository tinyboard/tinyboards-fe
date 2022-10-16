import { $fetch } from 'ohmyfetch'
import { baseURL } from '@/server/constants'

export async function fetchUser(username) {
	const user = await $fetch(`https://jsonplaceholder.typicode.com/users/?username=${username.value}`)
  	// const user = await $fetch(`${baseURL}/user/${id}`)
	return {
		id: user[0].id,
		username: user[0].username,
		// reputation: user.reputation,
		// created_time: user.created,
		// bio: user.bio,
		// post_count: user.post_count,
		// comment_count: user.post_count
	}
}
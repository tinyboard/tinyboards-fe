import { useApi } from "@/composables/api";

export async function getBoard(name) {

    async function request(name){
        const { data, pending, error, refresh } = await useApi("/board", {
            query: name,
            key: "name",
        });
        
        if (data.value) {
            let board_view = data.value["board_view"];
            let site = data.value["site"];
            let moderators = data.value["moderators"];
            let discussion_languages = data.value["discussion_languages"];
        
            return {
                pending,
                error,
                refresh,
                board_view,
                site,
                moderators,
                discussion_languages,
            };
        
        }
    };

    let {
        pending,
        error,
        refresh,
        board_view,
        site,
        moderators,
        discussion_languages
    } = await request(name);

    return {
        board_view,
        site,
        moderators,
        discussion_languages,
        pending,
        error,
        refresh
    };
}
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    login: { type: String, index: true },
    token: { type: String, index: true },
    hash: String,
    role: { type: String, default: 'user' },
    email: { type: String, index: true },
    avatar_url: String,
    name: String
});

mongoose.model('User', UserSchema);

/*
"login":"dnbard",
   "id":4028472,
   "avatar_url":"https://avatars.githubusercontent.com/u/4028472?v=2",
   "gravatar_id":"",
   "url":"https://api.github.com/users/dnbard",
   "html_url":"https://github.com/dnbard",
   "followers_url":"https://api.github.com/users/dnbard/followers",
   "following_url":"https://api.github.com/users/dnbard/following{/other_user}",
   "gists_url":"https://api.github.com/users/dnbard/gists{/gist_id}",
   "starred_url":"https://api.github.com/users/dnbard/starred{/owner}{/repo}",
   "subscriptions_url":"https://api.github.com/users/dnbard/subscriptions",
   "organizations_url":"https://api.github.com/users/dnbard/orgs",
   "repos_url":"https://api.github.com/users/dnbard/repos",
   "events_url":"https://api.github.com/users/dnbard/events{/privacy}",
   "received_events_url":"https://api.github.com/users/dnbard/received_events",
   "type":"User",
   "site_admin":false,
   "name":"Alex Bardanov",
   "company":"GlobalLogic",
   "blog":"",
   "location":"Ukraine, Kyiv",
   "email":"dnbard@gmail.com",
   "hireable":true,
   "bio":null,
   "public_repos":51,
   "public_gists":2,
   "followers":6,
   "following":7,
   "created_at":"2013-04-01T16:40:21Z",
   "updated_at":"2014-10-29T20:59:03Z"
}
*/

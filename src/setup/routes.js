// App imports
import PagesHome from 'modules/pages/Home'
import PagesAuthorize from 'modules/pages/Authorize'
import UserDashboard from 'modules/user/Dashboard'
import UserProfile from 'modules/user/Profile'
// import NoteList from 'modules/note/List'
import Marketplaces from 'modules/marketplace/List'
import MailList from 'modules/mail/List'

// Combined routes
const routes = {
  // pages home
  pagesHome: {
    path: '/',
    component: PagesHome,
    exact: true,
  },

  // pages authorize
  pagesAuthorize: {
    path: '/authorize',
    component: PagesAuthorize,
  },

  // user dashboard
  userDashboard: {
    path: '/dashboard',
    component: UserDashboard,
    auth: true,
  },

  // user profile
  userProfile: {
    path: '/profile',
    component: UserProfile,
    auth: true,
  },

  // Marketplaces list
  marketplaces: {
    path: '/marketplaces',
    component: Marketplaces,
    exact: true,
    auth: true,
  },
  
  // note list
  // noteList: {
  //   path: '/notes',
  //   component: NoteList,
  //   auth: true,
  // },
  
  // note list
  mailList: {
    path: '/mails',
    component: MailList,
    auth: true,
  },
}

export default routes

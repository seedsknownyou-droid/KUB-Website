/**
 * Route hash mapping.
 *
 * Every page of the app lives at a hashed address instead of a readable one, for example
 * /scanned-product-details  ->  /akKG60gcWJS3il
 * The pages themselves and the code only ever use the names below (ROUTES.purchases ...), so to change an
 * address you change ONE line here. The old readable addresses no longer exist: they go back to the home page.
 *
 *  - "/"        home page: the Welcome page (Sign In / Sign Up). A link that carries a QR hash opens Register instead.
 *  - "/r/<hash>" the link printed in the product QR code (the hash is mapped to the serial number by the backend)
 *
 * Note: hashed addresses only hide the page names. The real protection is on the server (QR hash lookup and
 * the SMS code for Sign In), because anything inside the app can be read by someone who opens the website.
 */
export const ROUTES = {
  home: '/',
  welcome: '/',
  qr: '/r',
  purchases: '/c3MO_m_aDXipS1',
  favorites: '/ZFRa9BGgrPooOX',
  profile: '/vgeNZ3aiWu06ty',
  profileEdit: '/FWKSV74IqW8x1o',
  profilePrivacy: '/nmFH_YrrK4qYDh',
  productDetails: '/akKG60gcWJS3il',
  contactSupport: '/VBZLoOvLgANUm3',
  feedback: '/zhL6GjeBYHEXtU',
  signIn: '/5azsh3U8bLVPGB',
  signUp: '/Ilh6itM8xuAe_T'
} as const;
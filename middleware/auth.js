export default function ({redirect, $next}) {
  // Add the userAgent property to the context
  if(process.client){
    const token = localStorage.getItem("user");
  if(!token){
    return redirect('/login');
  }
  return $next;
  }

}

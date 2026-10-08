const cfg=window.READING_LIST_CONFIG;
const db=window.supabase.createClient(cfg.supabaseUrl,cfg.supabasePublishableKey);
const statuses=['Reading','Finished','Want to Read'];
function el(tag,cls,text){const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;}
function friendlyError(error){return error?.message||'Something went wrong. Please try again.';}

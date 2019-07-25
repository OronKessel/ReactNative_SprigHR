export function activateLoader(ctx,text){
    ctx.setState({
        loading:true,
        loadingText: text
    });
}
export function stopLoader(ctx){
    ctx.setState({
        loading:false,
    });
}
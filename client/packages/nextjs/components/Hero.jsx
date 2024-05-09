function HeroBanner() {
    return(
        <section style={{marginBottom:'-3vh'}} className="bg-gradient-to-b from-cyan-400 to-cyan-100 dark:bg-gradient-to-b dark:from-cyan-900 dark:to-cyan-500 flex items-left flex-col flex-grow pt-10 ">
    <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
        <a href="#" className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-gray-700 bg-gray-100 rounded-full dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700" role="alert">
            <span className="poppins-bold text-xs bg-primary-600 rounded-full dark:text-white px-4 py-1.5 mr-3">NEW</span> <span className="text-sm font-medium">Dead Man's Switch is out! See what's new</span> 
            <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
        </a>
        <h1 style={{letterSpacing:'0.05vh'}} className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Become a Catalyst for Change, Anonymously.</h1>
        <p className="mb-8 text-lg font-normal text-black lg:text-xl sm:px-16 xl:px-48 dark:text-white">Do you witness injustice within your organization?<b> You are not alone. </b>Here, at HushZK, we offer a secure platform for whistleblowers to speak up anonymously. <b>Report misconduct</b> and be the hero your cause needs.</p>
        <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
           
            <a
                href="/get-started"
                style={{border:'none'}}
                className="btn bg-teal-500 rounded-md  text-sm font-semibold text-white shadow-sm hover:bg-teal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
               Let's Get Started!
              </a>

            <a href="#" className="inline-flex justify-center items-center py-3 px-5 text-black font-medium text-center dark:text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900 ">
                <span style={{paddingRight:'0.5vw'}} className="hover:underline">Learn More about HUSH</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
</svg>

            </a>
        </div>
    </div>
</section>
    )
    
}

export default HeroBanner
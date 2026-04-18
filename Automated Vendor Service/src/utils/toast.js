// Toast notification utility
export function showToast(title, message, type = 'info') {
  // Create toast element
  const toast = document.createElement('div')
  toast.className = `fixed top-4 right-4 z-50 max-w-sm w-full bg-white dark:bg-slate-800 border-l-4 ${
    type === 'error' ? 'border-red-500' : 
    type === 'success' ? 'border-green-500' : 
    'border-blue-500'
  } rounded-lg shadow-lg transform transition-all duration-300 translate-x-full`
  
  toast.innerHTML = `
    <div class="p-4">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          ${type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️'}
        </div>
        <div class="ml-3 w-0 flex-1">
          <p class="text-sm font-medium text-gray-900 dark:text-white">${title}</p>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">${message}</p>
        </div>
        <div class="ml-4 flex-shrink-0 flex">
          <button class="bg-white dark:bg-slate-800 rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span class="sr-only">Close</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `

  // Add click handler for close button
  const closeBtn = toast.querySelector('button')
  closeBtn.addEventListener('click', () => {
    toast.classList.add('translate-x-full')
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast)
      }
    }, 300)
  })

  // Add to DOM
  document.body.appendChild(toast)

  // Animate in
  setTimeout(() => {
    toast.classList.remove('translate-x-full')
  }, 100)

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.classList.add('translate-x-full')
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast)
        }
      }, 300)
    }
  }, 5000)
}

// Convenience functions for different toast types
export const toast = {
  success: (title, message) => showToast(title, message, 'success'),
  error: (title, message) => showToast(title, message, 'error'),
  info: (title, message) => showToast(title, message, 'info'),
  warning: (title, message) => showToast(title, message, 'warning')
}

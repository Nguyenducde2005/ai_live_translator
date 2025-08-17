'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { APP_CONSTANTS } from '@/lib/constants/app'

export function MainFooter() {
    const t = useTranslations()
    const locale = useLocale()

    return (
        <footer className="bg-background border-t border-border/50">
            <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-10 h-10 flex items-center justify-center">
                                <img src={APP_CONSTANTS.LOGO_PATH} alt="Logo" className="w-9 h-9" />
                            </div>
                            <span className="text-xl font-semibold text-gray-900">{APP_CONSTANTS.WEBSITE_NAME}</span>
                        </div>
                        <p className="text-gray-600 mb-4 max-w-md">
                            {t('footer.subtitle')}
                        </p>
                    </div>

                    {/* Slack API Links */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">{t('footer.slackApi')}</h3>
                        <ul className="space-y-2">
                            <li><a href="https://api.slack.com/docs" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-red-600 transition-colors">{t('footer.slackPlatform')}</a></li>
                            <li><a href="https://api.slack.com/docs/apps" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-red-600 transition-colors">{t('footer.slackApps')}</a></li>
                            <li><a href="https://api.slack.com/concepts" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-red-600 transition-colors">{t('footer.platformConcepts')}</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <div className="mb-6 flex justify-start">
                            <div className="h-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="16" viewBox="0 0 272 45" fill="none">
                                    <path fill="currentColor" d="M28.25 17.748h13.707v27.235h-22.34c-2.823 0-5.438-.565-7.839-1.696a18.78 18.78 0 0 1-6.205-4.657c-1.74-1.976-3.1-4.323-4.09-7.034C.494 28.882 0 25.938 0 22.766c0-3.171.493-6.068 1.486-8.697.989-2.627 2.35-4.885 4.09-6.776 1.733-1.891 3.8-3.345 6.205-4.368 2.398-1.02 5.013-1.53 7.839-1.53h23.313L36.41 12.733h-16.79c-1.363 0-2.626.26-3.799.78a8.912 8.912 0 0 0-3.039 2.217c-.86.955-1.533 2.073-2.023 3.354-.486 1.283-.726 2.704-.726 4.268 0 1.563.233 2.986.701 4.267.474 1.283 1.138 2.379 2 3.292a9.044 9.044 0 0 0 3.038 2.118c1.17.498 2.448.748 3.849.748h12.313l1.684-6.32h1.946l-7.312-9.709ZM57.969 44.986H47.891V23.822L57.969 1.395v43.59Z"></path>
                                    <path fill="#ED2647" d="M25.247 17.748H41.98L29.782 44.985l2.654-17.542-7.189-5.077v-4.618ZM44.19 1.395h13.775L47.923 23.819l2.183-14.443-5.916-4.18V1.396Z"></path>
                                    <path fill="currentColor" d="M158.776 44.987c-.793 0-1.58-.14-2.355-.416-.78-.28-1.643-.908-2.6-1.893l-24.469-23.58V44.28h-11.216V8.717c0-1.408.189-2.627.566-3.652.376-1.026.874-1.859 1.489-2.499a5.656 5.656 0 0 1 2.151-1.408 7.333 7.333 0 0 1 2.539-.45c.755 0 1.518.137 2.298.417.77.278 1.661.908 2.656 1.891l24.464 23.58V1.414h11.283v35.5c0 1.408-.191 2.626-.567 3.651-.38 1.026-.873 1.869-1.493 2.532a5.422 5.422 0 0 1-2.176 1.44 7.608 7.608 0 0 1-2.57.45ZM93.963 27.172a174.865 174.865 0 0 1 1.697 3.3 58.624 58.624 0 0 0 1.555 2.918l5.644 10.894h11.876L94.725 5.513C94.024 4.147 93.17 3 92.167 2.086 91.16 1.168 89.906.708 88.41.708c-1.496 0-2.86.49-3.88 1.475a13.455 13.455 0 0 0-2.533 3.332l-20.54 38.769h11.732l15.03-28.45 5.745 11.34v-.002ZM212.1 1.395l8.685 9.11h-22.386v34.48h-10.074v-34.48h-18.064v-9.11H212.1Z"></path>
                                    <path fill="currentColor" d="M99.996 25.026H76.683v11.213h23.313V25.026ZM271.508 1.405 257.51 32.659l-6.124 12.317-12.36-.065 7.562-13.708L217.3 1.405h15.214l19.039 19.3 9.342-19.3h10.613Z"></path>
                                    <path fill="#ED2647" d="M252.294 1.404h19.2L257.496 32.66l3.047-20.129-8.249-5.828V1.404ZM25.247 17.748H41.98L29.782 44.985l2.654-17.542-7.189-5.077v-4.618Z"></path>
                                </svg>
                            </div>
                        </div>
                        <p className="mb-6 max-w-md text-foreground/70">
                            {t('gianty.desc')}
                        </p>
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail mr-3 h-5 w-5 text-red-500">
                                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                            </svg>
                            <a href="mailto:ai.partner@gianty.com" className="text-foreground/70 transition-colors hover:text-red-600">{t('gianty.email')}</a>
                        </div>
                        <div className="mt-6 flex space-x-4">
                            <a href="https://www.facebook.com/giantyglobal" target="_blank" rel="noopener noreferrer" className="group" aria-label={t('gianty.facebook')}>
                                <svg className="h-8 w-8 group-hover:text-blue-600" xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none">
                                    <rect width="44" height="44" rx="5" fill="white" fillOpacity="0.1"></rect>
                                    <path d="M23.5502 32V22.8777H26.6109L27.0701 19.3216H23.5502V17.0515C23.5502 16.0222 23.8348 15.3208 25.3124 15.3208L27.194 15.32V12.1392C26.8686 12.0969 25.7517 12 24.4517 12C21.7371 12 19.8786 13.657 19.8786 16.6993V19.3216H16.8086V22.8777H19.8786V32H23.5502Z" fill="currentColor"></path>
                                </svg>
                            </a>
                            <a href="http://linkedin.com/company/gianty" target="_blank" rel="noopener noreferrer" className="group" aria-label={t('gianty.linkedin')}>
                                <svg className="h-8 w-8 group-hover:text-[#0A66C2]" xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none">
                                    <rect width="44" height="44" rx="5" fill="white" fillOpacity="0.1"></rect>
                                    <g clipPath="url(#clip0_470_15581)">
                                        <path d="M31.9951 32.0008V32H32.0001V24.665C32.0001 21.0767 31.2276 18.3125 27.0326 18.3125C25.0159 18.3125 23.6626 19.4192 23.1101 20.4683H23.0517V18.6475H19.0742V32H23.2159V25.3883C23.2159 23.6475 23.5459 21.9642 25.7017 21.9642C27.8259 21.9642 27.8576 23.9508 27.8576 25.5V32.0008H31.9951Z" fill="currentColor"></path>
                                        <path d="M12.3281 18.6484H16.4748V32.0009H12.3281V18.6484Z" fill="currentColor"></path>
                                        <path d="M14.4017 12C13.0758 12 12 13.0758 12 14.4017C12 15.7275 13.0758 16.8258 14.4017 16.8258C15.7275 16.8258 16.8033 15.7275 16.8033 14.4017C16.8025 13.0758 15.7267 12 14.4017 12V12Z" fill="currentColor"></path>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_470_15581">
                                            <rect width="20" height="20" fill="currentColor" transform="translate(12 12)"></rect>
                                        </clipPath>
                                    </defs>
                                </svg>
                            </a>
                            <a href="https://x.com/giantyglobal" target="_blank" rel="noopener noreferrer" className="group" aria-label={t('gianty.x')}>
                                <svg className="h-8 w-8 group-hover:text-black" width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="44" height="44" rx="5" fill="white" fillOpacity="0.1"></rect>
                                    <path d="M12 12.4029H17.9152L23.3827 19.7574L30.1884 12.2344L31.8055 12.2625L24.1889 20.8154L32 31.3205H26.0872L20.9266 24.4669L14.6225 31.489H13.0312L20.1439 23.4651L12 12.4029ZM17.3574 13.489H14.2334L26.7317 30.2063H29.7994L17.3574 13.489Z" fill="currentColor"></path>
                                </svg>
                            </a>
                            <a href="https://www.youtube.com/@giantysan" target="_blank" rel="noopener noreferrer" className="group" aria-label={t('gianty.youtube')}>
                                <svg className="h-8 w-8 group-hover:text-red-600" xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none">
                                    <rect width="44" height="44" rx="5" fill="white" fillOpacity="0.1"></rect>
                                    <g clipPath="url(#clip0_470_15582)">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M29.8252 15.4361C30.6819 15.6668 31.3574 16.3422 31.5879 17.199C32.0164 18.7639 31.9999 22.0259 31.9999 22.0259C31.9999 22.0259 31.9999 25.2713 31.5881 26.8364C31.3574 27.693 30.682 28.3685 29.8252 28.5991C28.2602 29.011 22 29.011 22 29.011C22 29.011 15.7561 29.011 14.1747 28.5827C13.3179 28.352 12.6425 27.6765 12.4118 26.8199C12 25.2713 12 22.0094 12 22.0094C12 22.0094 12 18.7639 12.4118 17.199C12.6424 16.3423 13.3344 15.6504 14.1745 15.4198C15.7396 15.0078 21.9998 15.0078 21.9998 15.0078C21.9998 15.0078 28.2602 15.0078 29.8252 15.4361ZM25.2122 22.0094L20.0063 25.0077V19.011L25.2122 22.0094Z" fill="currentColor"></path>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_470_15582">
                                            <rect width="20" height="20" fill="currentColor" transform="translate(12 12)"></rect>
                                        </clipPath>
                                    </defs>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-200 mt-12 pt-8">
                    <p className="text-gray-600 text-sm text-center">
                        {t('footer.copyright')}
                    </p>
                </div>
            </div>
        </footer>
    )
} 
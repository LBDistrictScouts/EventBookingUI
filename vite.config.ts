import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

interface GalleryImage {
  src: string
  alt: string
}

function toAltText(fileName: string): string {
  const baseName = fileName.replace(/\.[^.]+$/, '')

  return baseName
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim() || "Last year's walk photo"
}

function buildLastYearGallery(): GalleryImage[] {
  const galleryDir = path.resolve(__dirname, 'public/img/last-year')

  if (!fs.existsSync(galleryDir)) {
    return []
  }

  const supportedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif'])

  const files = fs
    .readdirSync(galleryDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((fileName) => supportedExtensions.has(path.extname(fileName).toLowerCase()))
    .sort((left, right) => left.localeCompare(right))

  return files.map((fileName) => ({
    src: `/img/last-year/${fileName}`,
    alt: toAltText(fileName),
  }))
}

function lastYearGalleryPlugin(): Plugin {
  const virtualModuleId = 'virtual:last-year-gallery'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'last-year-gallery',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }

      return null
    },
    load(id) {
      if (id !== resolvedVirtualModuleId) {
        return null
      }

      const images = buildLastYearGallery()
      return `export const galleryImages = ${JSON.stringify(images)};`
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), lastYearGalleryPlugin()],
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: ['node_modules'],
        quietDeps: true,
      },
    },
  },
})

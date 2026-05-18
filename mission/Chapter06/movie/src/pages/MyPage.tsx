import { useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import useLocalStorage from '../hooks/useLocalStorage'
import type { UserToken } from '../types/lp'

interface Me {
  id: number
  name: string
  email: string
  bio: string | null
  avatar: string | null
}

const MyPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [token, setToken] = useLocalStorage<UserToken | null>('token', null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [nameValue, setNameValue] = useState('')
  const [bioValue, setBioValue] = useState('')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<string>('')

  const { data: me, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const { data } = await api.get<{ data: Me }>('/v1/users/me')
      return data.data
    },
    enabled: !!token,
  })

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: () =>
      api.patch('/v1/users', {
        name: nameValue,
        bio: bioValue || null,
        ...(avatarFile && { avatar: avatarFile }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
      if (token) setToken({ ...token, name: nameValue })
      setIsEditing(false)
      setAvatarFile('')
    },
  })

  const handleEditStart = () => {
    if (!me) return
    setNameValue(me.name)
    setBioValue(me.bio ?? '')
    setAvatarPreview(null)
    setAvatarFile('')
    setIsEditing(true)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setAvatarPreview(result)
      setAvatarFile(result)
    }
    reader.readAsDataURL(file)
  }

  if (!token) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <p className="text-neutral-400">
          <button type="button" onClick={() => navigate('/login')} className="text-pink-400 hover:underline">로그인</button>
          {' '}후 이용할 수 있습니다.
        </p>
      </div>
    )
  }

  if (isLoading || !me) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-600 border-t-white" />
      </div>
    )
  }

  const displayAvatar = avatarPreview ?? me.avatar

  return (
    <div className="min-h-full bg-black p-8">
      <div className="mx-auto max-w-lg">
        <div className="flex items-center gap-6">
          {/* 아바타 */}
          <div className="relative">
            <button
              type="button"
              onClick={() => isEditing && fileInputRef.current?.click()}
              className={`h-24 w-24 overflow-hidden rounded-full bg-neutral-700 ${isEditing ? 'cursor-pointer ring-2 ring-pink-500' : ''}`}
              aria-label="프로필 사진 변경"
            >
              {displayAvatar ? (
                <img src={displayAvatar} alt="프로필" className="h-full w-full object-cover" />
              ) : (
                <DefaultAvatar />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          {/* 정보 */}
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    className="flex-1 rounded-lg border border-white/30 bg-black px-3 py-2 text-sm text-white outline-none focus:border-white/60"
                  />
                  <button
                    type="button"
                    onClick={() => updateProfile()}
                    disabled={isPending || !nameValue.trim()}
                    className="text-white/70 hover:text-white disabled:opacity-40"
                    aria-label="저장"
                  >
                    <CheckIcon />
                  </button>
                </div>
                <input
                  type="text"
                  value={bioValue}
                  onChange={(e) => setBioValue(e.target.value)}
                  placeholder="bio (선택)"
                  className="w-full rounded-lg border border-white/30 bg-black px-3 py-2 text-sm text-white outline-none focus:border-white/60"
                />
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-neutral-500 hover:text-neutral-300"
                >
                  취소
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-white">{me.name}</span>
                  <button
                    type="button"
                    onClick={handleEditStart}
                    className="text-neutral-400 hover:text-white"
                    aria-label="프로필 편집"
                  >
                    <GearIcon />
                  </button>
                </div>
                {me.bio && <p className="mt-1 text-sm text-neutral-300">{me.bio}</p>}
                <p className="mt-1 text-sm text-neutral-500">{me.email}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const DefaultAvatar = () => (
  <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
    <rect width="100" height="100" fill="#404040" />
    <circle cx="50" cy="38" r="18" fill="#888" />
    <ellipse cx="50" cy="82" rx="28" ry="20" fill="#888" />
  </svg>
)

const GearIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export default MyPage

from pathlib import Path
file_path = Path('src/lib/api.ts')
text = file_path.read_text(encoding='utf-8')
if 'export async function deleteNewsletter' not in text:
    addition = "\nexport async function deleteNewsletter(id: number) {\n  const authSession = getAuthSession();\n  if (!authSession) {\n    return { success: false, error: \"Not authenticated\", status: 401 };\n  }\n\n  let response: Response;\n  try {\n    response = await fetch(`${API_BASE_URL}/newsletter/${id}`, {\n      method: \"DELETE\",\n      headers: {\n        \"X-Auth-User-Id\": authSession.userId,\n        \"X-Auth-Role\": authSession.role,\n      },\n    });\n  } catch (error) {\n    return {\n      success: false,\n      error: error instanceof Error ? error.message : \"Network error\",\n      status: 0,\n    };\n  }\n\n  const data = await response.json();\n\n  if (!response.ok) {\n    return {\n      success: false,\n      error: data?.error || response.statusText || \"Unknown error\",\n      status: response.status,\n    };\n  }\n\n  return { success: true, data };\n}\n"
    file_path.write_text(text + addition, encoding='utf-8')
    print('Appended deleteNewsletter helper')
else:
    print('deleteNewsletter already present')

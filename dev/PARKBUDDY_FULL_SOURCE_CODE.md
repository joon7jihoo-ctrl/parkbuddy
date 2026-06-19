# ParkBuddy 최종 완성형 전체 소스 코드

이 문서는 최종 완성형 ParkBuddy 프로젝트의 주요 실행 소스 전체를 파일별로 이어 붙인 원본 코드입니다.

- 실제 프로젝트 사용은 ZIP 전체를 압축 해제해서 사용하는 것을 권장합니다.
- 아래 코드는 검토/복사용 보조 문서입니다.
- 제외: `node_modules`, `.next`, `.git`, 백업 파일, 빌드 캐시.



---

## `.npmrc`

```text
registry=https://registry.npmjs.org/
audit=false
fund=false
engine-strict=true
save-exact=true

```


---

## `eslint.config.mjs`

```js
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const eslintConfig = [
  {
    ignores: ['.next/**', 'node_modules/**', 'coverage/**'],
  },
  ...nextVitals,
  ...nextTypescript,
];

export default eslintConfig;

```


---

## `middleware.ts`

```ts
import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

```


---

## `next.config.mjs`

```js
/** @type {import('next').NextConfig} */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

let remotePatterns = [];
try {
  if (supabaseUrl) {
    const parsed = new URL(supabaseUrl);
    remotePatterns = [
      {
        protocol: parsed.protocol.replace(':', ''),
        hostname: parsed.hostname,
        pathname: '/storage/v1/object/public/**',
      },
    ];
  }
} catch {
  remotePatterns = [];
}

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=()',
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

```


---

## `package-lock.json`

```json
{
  "name": "parkbuddy-secure",
  "version": "0.10.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "parkbuddy-secure",
      "version": "0.10.0",
      "dependencies": {
        "@supabase/ssr": "^0.12.0",
        "@supabase/supabase-js": "^2.108.1",
        "clsx": "^2.1.1",
        "lucide-react": "^1.17.0",
        "next": "^16.2.9",
        "react": "^19.2.7",
        "react-dom": "^19.2.7",
        "recharts": "^3.8.1",
        "zod": "^4.4.3"
      },
      "devDependencies": {
        "@eslint/eslintrc": "^3.3.3",
        "@types/node": "^20.17.10",
        "@types/react": "^19.2.7",
        "@types/react-dom": "^19.2.3",
        "autoprefixer": "^10.4.20",
        "eslint": "^9.39.1",
        "eslint-config-next": "^16.2.9",
        "postcss": "^8.5.10",
        "tailwindcss": "^3.4.17",
        "typescript": "^5.9.3"
      },
      "engines": {
        "node": ">=20.11.0"
      }
    },
    "node_modules/@alloc/quick-lru": {
      "version": "5.2.0",
      "resolved": "https://registry.npmjs.org/@alloc/quick-lru/-/quick-lru-5.2.0.tgz",
      "integrity": "sha512-UrcABB+4bUrFABwbluTIBErXwvbsU/V7TZWfmbgJfbkwiBuziS9gxdODUyuiecfdGQ85jglMW6juS3+z5TsKLw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/@babel/code-frame": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.29.7.tgz",
      "integrity": "sha512-Aup7aUOfpbAUg2ROOJN6Iw5f9DMBlzu0mIkm/malLQFN/YQgO48wCj0Kxa3sEHJvPVFg7siR+qRInwXd2qhQKw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/helper-validator-identifier": "^7.29.7",
        "js-tokens": "^4.0.0",
        "picocolors": "^1.1.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/compat-data": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/compat-data/-/compat-data-7.29.7.tgz",
      "integrity": "sha512-locTkQyKvwIEgBzVrn8693ebc97F2U8ZHjbXwDXJ5Fn2TCpNwTlKcaKLkdHop5c/icOFE7qt7Q9JC5hnKNa6Gg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/core": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/core/-/core-7.29.7.tgz",
      "integrity": "sha512-RgHBCvtjbOK2gXSNBNIkNoEc9qoVEtau3hj8gEqKQuL3HZAibKarWFEI3Lfm6EYKkLalOh8eSrj9b+ch9H/VBA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/code-frame": "^7.29.7",
        "@babel/generator": "^7.29.7",
        "@babel/helper-compilation-targets": "^7.29.7",
        "@babel/helper-module-transforms": "^7.29.7",
        "@babel/helpers": "^7.29.7",
        "@babel/parser": "^7.29.7",
        "@babel/template": "^7.29.7",
        "@babel/traverse": "^7.29.7",
        "@babel/types": "^7.29.7",
        "@jridgewell/remapping": "^2.3.5",
        "convert-source-map": "^2.0.0",
        "debug": "^4.1.0",
        "gensync": "^1.0.0-beta.2",
        "json5": "^2.2.3",
        "semver": "^6.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/babel"
      }
    },
    "node_modules/@babel/core/node_modules/json5": {
      "version": "2.2.3",
      "resolved": "https://registry.npmjs.org/json5/-/json5-2.2.3.tgz",
      "integrity": "sha512-XmOWe7eyHYH14cLdVPoyg+GOH3rYX++KpzrylJwSW98t3Nk+U8XOl8FWKOgwtzdb8lXGf6zYwDUzeHMWfxasyg==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "json5": "lib/cli.js"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/@babel/core/node_modules/semver": {
      "version": "6.3.1",
      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",
      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",
      "dev": true,
      "bin": {
        "semver": "bin/semver.js"
      }
    },
    "node_modules/@babel/generator": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/generator/-/generator-7.29.7.tgz",
      "integrity": "sha512-DkXD5OJQaAQIdZ1bt3UZdEnHAn9Imd3IVBdX03UFe+ony9Ojw5pzr9YVKGDY1jt+Gcn/FnGkNf8r+Vj5NOJWtQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/parser": "^7.29.7",
        "@babel/types": "^7.29.7",
        "@jridgewell/gen-mapping": "^0.3.12",
        "@jridgewell/trace-mapping": "^0.3.28",
        "jsesc": "^3.0.2"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-compilation-targets": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-compilation-targets/-/helper-compilation-targets-7.29.7.tgz",
      "integrity": "sha512-wem6WaBj4NaVYVdNhLPPVacES6ZJ+KBBfSkTMD3YZxbP3rm3Di85tJU5ljaUNhaOynt+Aj0xruhYuzQBt8n71g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/compat-data": "^7.29.7",
        "@babel/helper-validator-option": "^7.29.7",
        "browserslist": "^4.24.0",
        "lru-cache": "^5.1.1",
        "semver": "^6.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-compilation-targets/node_modules/semver": {
      "version": "6.3.1",
      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",
      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",
      "dev": true,
      "bin": {
        "semver": "bin/semver.js"
      }
    },
    "node_modules/@babel/helper-globals": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-globals/-/helper-globals-7.29.7.tgz",
      "integrity": "sha512-3nQVUAtvkKH9zahfWgw96Jc/uFOmjACE1kQz82E2lqWmHBgjzbNlsC22nuQTfahmWeQtTq5nQ/4Nnd2A1wj4zA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-module-imports": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-module-imports/-/helper-module-imports-7.29.7.tgz",
      "integrity": "sha512-ejHwrQQYcm9xnTivShn2IDOlIzInN34AXskvq9QicvCtEzq1Vzclu/tKF8Jq1Cg8JG2GL6/EmjgsCT7lXepE3g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/traverse": "^7.29.7",
        "@babel/types": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-module-transforms": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-module-transforms/-/helper-module-transforms-7.29.7.tgz",
      "integrity": "sha512-UPUVSyXbOh627KiCIGQSgwWzGeBKLkaJ9PJEdrngIwMSzxLR4jS4+f1f1jb7VzBbg8nFLaYotvVPFCTqdrmTAg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/helper-module-imports": "^7.29.7",
        "@babel/helper-validator-identifier": "^7.29.7",
        "@babel/traverse": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0"
      }
    },
    "node_modules/@babel/helper-string-parser": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-string-parser/-/helper-string-parser-7.29.7.tgz",
      "integrity": "sha512-Pb5ijPrZ89GDH8223L4UP8i6QApWxs04RbPQJTeWDV0/keR2E36MeKnyr6LYmUUvqRRI+Iv87SuF1W6ErINzYw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-validator-identifier": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-validator-identifier/-/helper-validator-identifier-7.29.7.tgz",
      "integrity": "sha512-qehxGkRj55h/ff8EMaJ+cYhyaKlHIxqYDn682wQD7RNp9UujOQsHog2uS0r2vzr4pW+sXf90NeeayjcNaX3fFg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-validator-option": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-validator-option/-/helper-validator-option-7.29.7.tgz",
      "integrity": "sha512-N9ZErrD+yW5geCDtBqnOoxmR8+tNKiGuxKlDpuJxfsqpa2dFcexaziGAE/qoHLiDDreVNMupxGmSoNlyvsA3gw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helpers": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helpers/-/helpers-7.29.7.tgz",
      "integrity": "sha512-1k2lAGRMfHTcwuNYcCNUmaUffmQv8KWMfh2iJUUeRlwlwH4FdNG7mfPI10NPfLHJFThE4Tyr4mv7kTNZOiPuBg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/template": "^7.29.7",
        "@babel/types": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/parser": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/parser/-/parser-7.29.7.tgz",
      "integrity": "sha512-hnORnjP/1P/zFEndoeX+n+t1RwWRJiJpM/jO7FW32Kn9r5+sJB2JWOdYo4L6k78j15eCwY3Gm/7364B1EMwtNg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/types": "^7.29.7"
      },
      "bin": {
        "parser": "bin/babel-parser.js"
      },
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@babel/template": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/template/-/template-7.29.7.tgz",
      "integrity": "sha512-puq+Gf35oI24FeN11LkoUQFqv9uwNeWpxXZi/Ji3rRIoKAzKnxRaZ+Gkj0vKS9ZCiTESfng1N9LyOyXvo+m+Gg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/code-frame": "^7.29.7",
        "@babel/parser": "^7.29.7",
        "@babel/types": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/traverse": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/traverse/-/traverse-7.29.7.tgz",
      "integrity": "sha512-EhlfNQtZ+NK22w5BM61ciuiq1m58ed33Wr1Xan//ZRTy6hgjnwyCffRYwzsGXdASJSUJ1guZILsErh1eQcl+zw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/code-frame": "^7.29.7",
        "@babel/generator": "^7.29.7",
        "@babel/helper-globals": "^7.29.7",
        "@babel/parser": "^7.29.7",
        "@babel/template": "^7.29.7",
        "@babel/types": "^7.29.7",
        "debug": "^4.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/types": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/types/-/types-7.29.7.tgz",
      "integrity": "sha512-4zBIxpPzowiZpusoFkyGVwakdRJUyuH5PxQ/PrqghfdFWWasvnCdPfQXHrenDai+gyLARulZjZowCOj6fjT4pA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/helper-string-parser": "^7.29.7",
        "@babel/helper-validator-identifier": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@emnapi/core": {
      "version": "1.10.0",
      "resolved": "https://registry.npmjs.org/@emnapi/core/-/core-1.10.0.tgz",
      "integrity": "sha512-yq6OkJ4p82CAfPl0u9mQebQHKPJkY7WrIuk205cTYnYe+k2Z8YBh11FrbRG/H6ihirqcacOgl2BIO8oyMQLeXw==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "@emnapi/wasi-threads": "1.2.1",
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@emnapi/runtime": {
      "version": "1.11.0",
      "resolved": "https://registry.npmjs.org/@emnapi/runtime/-/runtime-1.11.0.tgz",
      "integrity": "sha512-55coeOFKHv1ywEcUXJtWU5f+Jr/W5tZDvZig8DLKSwUN1JpROQ4rk/SNOQiFWmaR/VKF4zuFyW1B8JduOSv6Pg==",
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@emnapi/wasi-threads": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/@emnapi/wasi-threads/-/wasi-threads-1.2.1.tgz",
      "integrity": "sha512-uTII7OYF+/Mes/MrcIOYp5yOtSMLBWSIoLPpcgwipoiKbli6k322tcoFsxoIIxPDqW01SQGAgko4EzZi2BNv2w==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@eslint-community/eslint-utils": {
      "version": "4.9.1",
      "resolved": "https://registry.npmjs.org/@eslint-community/eslint-utils/-/eslint-utils-4.9.1.tgz",
      "integrity": "sha512-phrYmNiYppR7znFEdqgfWHXR6NCkZEK7hwWDHZUjit/2/U0r6XvkDl0SYnoM51Hq7FhCGdLDT6zxCCOY1hexsQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "eslint-visitor-keys": "^3.4.3"
      },
      "engines": {
        "node": "^12.22.0 || ^14.17.0 || >=16.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      },
      "peerDependencies": {
        "eslint": "^6.0.0 || ^7.0.0 || >=8.0.0"
      }
    },
    "node_modules/@eslint-community/eslint-utils/node_modules/eslint-visitor-keys": {
      "version": "3.4.3",
      "resolved": "https://registry.npmjs.org/eslint-visitor-keys/-/eslint-visitor-keys-3.4.3.tgz",
      "integrity": "sha512-wpc+LXeiyiisxPlEkUzU6svyS1frIO3Mgxj1fdy7Pm8Ygzguax2N3Fa/D/ag1WqbOprdI+uY6wMUl8/a2G+iag==",
      "dev": true,
      "engines": {
        "node": "^12.22.0 || ^14.17.0 || >=16.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/@eslint-community/regexpp": {
      "version": "4.12.2",
      "resolved": "https://registry.npmjs.org/@eslint-community/regexpp/-/regexpp-4.12.2.tgz",
      "integrity": "sha512-EriSTlt5OC9/7SXkRSCAhfSxxoSUgBm33OH+IkwbdpgoqsSsUg7y3uh+IICI/Qg4BBWr3U2i39RpmycbxMq4ew==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^12.0.0 || ^14.0.0 || >=16.0.0"
      }
    },
    "node_modules/@eslint/config-array": {
      "version": "0.21.2",
      "resolved": "https://registry.npmjs.org/@eslint/config-array/-/config-array-0.21.2.tgz",
      "integrity": "sha512-nJl2KGTlrf9GjLimgIru+V/mzgSK0ABCDQRvxw5BjURL7WfH5uoWmizbH7QB6MmnMBd8cIC9uceWnezL1VZWWw==",
      "dev": true,
      "dependencies": {
        "@eslint/object-schema": "^2.1.7",
        "debug": "^4.3.1",
        "minimatch": "^3.1.5"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      }
    },
    "node_modules/@eslint/config-helpers": {
      "version": "0.4.2",
      "resolved": "https://registry.npmjs.org/@eslint/config-helpers/-/config-helpers-0.4.2.tgz",
      "integrity": "sha512-gBrxN88gOIf3R7ja5K9slwNayVcZgK6SOUORm2uBzTeIEfeVaIhOpCtTox3P6R7o2jLFwLFTLnC7kU/RGcYEgw==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@eslint/core": "^0.17.0"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      }
    },
    "node_modules/@eslint/core": {
      "version": "0.17.0",
      "resolved": "https://registry.npmjs.org/@eslint/core/-/core-0.17.0.tgz",
      "integrity": "sha512-yL/sLrpmtDaFEiUj1osRP4TI2MDz1AddJL+jZ7KSqvBuliN4xqYY54IfdN8qD8Toa6g1iloph1fxQNkjOxrrpQ==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@types/json-schema": "^7.0.15"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      }
    },
    "node_modules/@eslint/eslintrc": {
      "version": "3.3.5",
      "resolved": "https://registry.npmjs.org/@eslint/eslintrc/-/eslintrc-3.3.5.tgz",
      "integrity": "sha512-4IlJx0X0qftVsN5E+/vGujTRIFtwuLbNsVUe7TO6zYPDR1O6nFwvwhIKEKSrl6dZchmYBITazxKoUYOjdtjlRg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ajv": "^6.14.0",
        "debug": "^4.3.2",
        "espree": "^10.0.1",
        "globals": "^14.0.0",
        "ignore": "^5.2.0",
        "import-fresh": "^3.2.1",
        "js-yaml": "^4.1.1",
        "minimatch": "^3.1.5",
        "strip-json-comments": "^3.1.1"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/@eslint/js": {
      "version": "9.39.4",
      "resolved": "https://registry.npmjs.org/@eslint/js/-/js-9.39.4.tgz",
      "integrity": "sha512-nE7DEIchvtiFTwBw4Lfbu59PG+kCofhjsKaCWzxTpt4lfRjRMqG6uMBzKXuEcyXhOHoUp9riAm7/aWYGhXZ9cw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://eslint.org/donate"
      }
    },
    "node_modules/@eslint/object-schema": {
      "version": "2.1.7",
      "resolved": "https://registry.npmjs.org/@eslint/object-schema/-/object-schema-2.1.7.tgz",
      "integrity": "sha512-VtAOaymWVfZcmZbp6E2mympDIHvyjXs/12LqWYjVw6qjrfF+VK+fyG33kChz3nnK+SU5/NeHOqrTEHS8sXO3OA==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      }
    },
    "node_modules/@eslint/plugin-kit": {
      "version": "0.4.1",
      "resolved": "https://registry.npmjs.org/@eslint/plugin-kit/-/plugin-kit-0.4.1.tgz",
      "integrity": "sha512-43/qtrDUokr7LJqoF2c3+RInu/t4zfrpYdoSDfYyhg52rwLV6TnOvdG4fXm7IkSB3wErkcmJS9iEhjVtOSEjjA==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@eslint/core": "^0.17.0",
        "levn": "^0.4.1"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      }
    },
    "node_modules/@humanfs/core": {
      "version": "0.19.2",
      "resolved": "https://registry.npmjs.org/@humanfs/core/-/core-0.19.2.tgz",
      "integrity": "sha512-UhXNm+CFMWcbChXywFwkmhqjs3PRCmcSa/hfBgLIb7oQ5HNb1wS0icWsGtSAUNgefHeI+eBrA8I1fxmbHsGdvA==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@humanfs/types": "^0.15.0"
      },
      "engines": {
        "node": ">=18.18.0"
      }
    },
    "node_modules/@humanfs/node": {
      "version": "0.16.8",
      "resolved": "https://registry.npmjs.org/@humanfs/node/-/node-0.16.8.tgz",
      "integrity": "sha512-gE1eQNZ3R++kTzFUpdGlpmy8kDZD/MLyHqDwqjkVQI0JMdI1D51sy1H958PNXYkM2rAac7e5/CnIKZrHtPh3BQ==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@humanfs/core": "^0.19.2",
        "@humanfs/types": "^0.15.0",
        "@humanwhocodes/retry": "^0.4.0"
      },
      "engines": {
        "node": ">=18.18.0"
      }
    },
    "node_modules/@humanfs/types": {
      "version": "0.15.0",
      "resolved": "https://registry.npmjs.org/@humanfs/types/-/types-0.15.0.tgz",
      "integrity": "sha512-ZZ1w0aoQkwuUuC7Yf+7sdeaNfqQiiLcSRbfI08oAxqLtpXQr9AIVX7Ay7HLDuiLYAaFPu8oBYNq/QIi9URHJ3Q==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">=18.18.0"
      }
    },
    "node_modules/@humanwhocodes/module-importer": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/@humanwhocodes/module-importer/-/module-importer-1.0.1.tgz",
      "integrity": "sha512-bxveV4V8v5Yb4ncFTT3rPSgZBOpCkjfK0y4oVVVJwIuDVBRMDXrPyXRL988i5ap9m9bnyEEjWfm5WkBmtffLfA==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">=12.22"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/nzakas"
      }
    },
    "node_modules/@humanwhocodes/retry": {
      "version": "0.4.3",
      "resolved": "https://registry.npmjs.org/@humanwhocodes/retry/-/retry-0.4.3.tgz",
      "integrity": "sha512-bV0Tgo9K4hfPCek+aMAn81RppFKv2ySDQeMoSZuvTASywNTnVJCArCZE2FWqpvIatKu7VMRLWlR1EazvVhDyhQ==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">=18.18"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/nzakas"
      }
    },
    "node_modules/@img/colour": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/@img/colour/-/colour-1.1.0.tgz",
      "integrity": "sha512-Td76q7j57o/tLVdgS746cYARfSyxk8iEfRxewL9h4OMzYhbW4TAcppl0mT4eyqXddh6L/jwoM75mo7ixa/pCeQ==",
      "license": "MIT",
      "optional": true,
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@img/sharp-darwin-arm64": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-darwin-arm64/-/sharp-darwin-arm64-0.34.5.tgz",
      "integrity": "sha512-imtQ3WMJXbMY4fxb/Ndp6HBTNVtWCUI0WdobyheGf5+ad6xX8VIDO8u2xE4qc/fr08CKG/7dDseFtn6M6g/r3w==",
      "cpu": [
        "arm64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-darwin-arm64": "1.2.4"
      }
    },
    "node_modules/@img/sharp-darwin-x64": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-darwin-x64/-/sharp-darwin-x64-0.34.5.tgz",
      "integrity": "sha512-YNEFAF/4KQ/PeW0N+r+aVVsoIY0/qxxikF2SWdp+NRkmMB7y9LBZAVqQ4yhGCm/H3H270OSykqmQMKLBhBJDEw==",
      "cpu": [
        "x64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-darwin-x64": "1.2.4"
      }
    },
    "node_modules/@img/sharp-libvips-darwin-arm64": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-darwin-arm64/-/sharp-libvips-darwin-arm64-1.2.4.tgz",
      "integrity": "sha512-zqjjo7RatFfFoP0MkQ51jfuFZBnVE2pRiaydKJ1G/rHZvnsrHAOcQALIi9sA5co5xenQdTugCvtb1cuf78Vf4g==",
      "cpu": [
        "arm64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "darwin"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-darwin-x64": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-darwin-x64/-/sharp-libvips-darwin-x64-1.2.4.tgz",
      "integrity": "sha512-1IOd5xfVhlGwX+zXv2N93k0yMONvUlANylbJw1eTah8K/Jtpi15KC+WSiaX/nBmbm2HxRM1gZ0nSdjSsrZbGKg==",
      "cpu": [
        "x64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "darwin"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-arm": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-arm/-/sharp-libvips-linux-arm-1.2.4.tgz",
      "integrity": "sha512-bFI7xcKFELdiNCVov8e44Ia4u2byA+l3XtsAj+Q8tfCwO6BQ8iDojYdvoPMqsKDkuoOo+X6HZA0s0q11ANMQ8A==",
      "cpu": [
        "arm"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-arm64": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-arm64/-/sharp-libvips-linux-arm64-1.2.4.tgz",
      "integrity": "sha512-excjX8DfsIcJ10x1Kzr4RcWe1edC9PquDRRPx3YVCvQv+U5p7Yin2s32ftzikXojb1PIFc/9Mt28/y+iRklkrw==",
      "cpu": [
        "arm64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-ppc64": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-ppc64/-/sharp-libvips-linux-ppc64-1.2.4.tgz",
      "integrity": "sha512-FMuvGijLDYG6lW+b/UvyilUWu5Ayu+3r2d1S8notiGCIyYU/76eig1UfMmkZ7vwgOrzKzlQbFSuQfgm7GYUPpA==",
      "cpu": [
        "ppc64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-riscv64": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-riscv64/-/sharp-libvips-linux-riscv64-1.2.4.tgz",
      "integrity": "sha512-oVDbcR4zUC0ce82teubSm+x6ETixtKZBh/qbREIOcI3cULzDyb18Sr/Wcyx7NRQeQzOiHTNbZFF1UwPS2scyGA==",
      "cpu": [
        "riscv64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-s390x": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-s390x/-/sharp-libvips-linux-s390x-1.2.4.tgz",
      "integrity": "sha512-qmp9VrzgPgMoGZyPvrQHqk02uyjA0/QrTO26Tqk6l4ZV0MPWIW6LTkqOIov+J1yEu7MbFQaDpwdwJKhbJvuRxQ==",
      "cpu": [
        "s390x"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-x64": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-x64/-/sharp-libvips-linux-x64-1.2.4.tgz",
      "integrity": "sha512-tJxiiLsmHc9Ax1bz3oaOYBURTXGIRDODBqhveVHonrHJ9/+k89qbLl0bcJns+e4t4rvaNBxaEZsFtSfAdquPrw==",
      "cpu": [
        "x64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linuxmusl-arm64": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linuxmusl-arm64/-/sharp-libvips-linuxmusl-arm64-1.2.4.tgz",
      "integrity": "sha512-FVQHuwx1IIuNow9QAbYUzJ+En8KcVm9Lk5+uGUQJHaZmMECZmOlix9HnH7n1TRkXMS0pGxIJokIVB9SuqZGGXw==",
      "cpu": [
        "arm64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linuxmusl-x64": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linuxmusl-x64/-/sharp-libvips-linuxmusl-x64-1.2.4.tgz",
      "integrity": "sha512-+LpyBk7L44ZIXwz/VYfglaX/okxezESc6UxDSoyo2Ks6Jxc4Y7sGjpgU9s4PMgqgjj1gZCylTieNamqA1MF7Dg==",
      "cpu": [
        "x64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-linux-arm": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-arm/-/sharp-linux-arm-0.34.5.tgz",
      "integrity": "sha512-9dLqsvwtg1uuXBGZKsxem9595+ujv0sJ6Vi8wcTANSFpwV/GONat5eCkzQo/1O6zRIkh0m/8+5BjrRr7jDUSZw==",
      "cpu": [
        "arm"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-arm": "1.2.4"
      }
    },
    "node_modules/@img/sharp-linux-arm64": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-arm64/-/sharp-linux-arm64-0.34.5.tgz",
      "integrity": "sha512-bKQzaJRY/bkPOXyKx5EVup7qkaojECG6NLYswgktOZjaXecSAeCWiZwwiFf3/Y+O1HrauiE3FVsGxFg8c24rZg==",
      "cpu": [
        "arm64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-arm64": "1.2.4"
      }
    },
    "node_modules/@img/sharp-linux-ppc64": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-ppc64/-/sharp-linux-ppc64-0.34.5.tgz",
      "integrity": "sha512-7zznwNaqW6YtsfrGGDA6BRkISKAAE1Jo0QdpNYXNMHu2+0dTrPflTLNkpc8l7MUP5M16ZJcUvysVWWrMefZquA==",
      "cpu": [
        "ppc64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-ppc64": "1.2.4"
      }
    },
    "node_modules/@img/sharp-linux-riscv64": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-riscv64/-/sharp-linux-riscv64-0.34.5.tgz",
      "integrity": "sha512-51gJuLPTKa7piYPaVs8GmByo7/U7/7TZOq+cnXJIHZKavIRHAP77e3N2HEl3dgiqdD/w0yUfiJnII77PuDDFdw==",
      "cpu": [
        "riscv64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-riscv64": "1.2.4"
      }
    },
    "node_modules/@img/sharp-linux-s390x": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-s390x/-/sharp-linux-s390x-0.34.5.tgz",
      "integrity": "sha512-nQtCk0PdKfho3eC5MrbQoigJ2gd1CgddUMkabUj+rBevs8tZ2cULOx46E7oyX+04WGfABgIwmMC0VqieTiR4jg==",
      "cpu": [
        "s390x"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-s390x": "1.2.4"
      }
    },
    "node_modules/@img/sharp-linux-x64": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-x64/-/sharp-linux-x64-0.34.5.tgz",
      "integrity": "sha512-MEzd8HPKxVxVenwAa+JRPwEC7QFjoPWuS5NZnBt6B3pu7EG2Ge0id1oLHZpPJdn3OQK+BQDiw9zStiHBTJQQQQ==",
      "cpu": [
        "x64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-x64": "1.2.4"
      }
    },
    "node_modules/@img/sharp-linuxmusl-arm64": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-linuxmusl-arm64/-/sharp-linuxmusl-arm64-0.34.5.tgz",
      "integrity": "sha512-fprJR6GtRsMt6Kyfq44IsChVZeGN97gTD331weR1ex1c1rypDEABN6Tm2xa1wE6lYb5DdEnk03NZPqA7Id21yg==",
      "cpu": [
        "arm64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linuxmusl-arm64": "1.2.4"
      }
    },
    "node_modules/@img/sharp-linuxmusl-x64": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-linuxmusl-x64/-/sharp-linuxmusl-x64-0.34.5.tgz",
      "integrity": "sha512-Jg8wNT1MUzIvhBFxViqrEhWDGzqymo3sV7z7ZsaWbZNDLXRJZoRGrjulp60YYtV4wfY8VIKcWidjojlLcWrd8Q==",
      "cpu": [
        "x64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linuxmusl-x64": "1.2.4"
      }
    },
    "node_modules/@img/sharp-wasm32": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-wasm32/-/sharp-wasm32-0.34.5.tgz",
      "integrity": "sha512-OdWTEiVkY2PHwqkbBI8frFxQQFekHaSSkUIJkwzclWZe64O1X4UlUjqqqLaPbUpMOQk6FBu/HtlGXNblIs0huw==",
      "cpu": [
        "wasm32"
      ],
      "license": "Apache-2.0 AND LGPL-3.0-or-later AND MIT",
      "optional": true,
      "dependencies": {
        "@emnapi/runtime": "^1.7.0"
      },
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-win32-arm64": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-win32-arm64/-/sharp-win32-arm64-0.34.5.tgz",
      "integrity": "sha512-WQ3AgWCWYSb2yt+IG8mnC6Jdk9Whs7O0gxphblsLvdhSpSTtmu69ZG1Gkb6NuvxsNACwiPV6cNSZNzt0KPsw7g==",
      "cpu": [
        "arm64"
      ],
      "license": "Apache-2.0 AND LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-win32-ia32": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-win32-ia32/-/sharp-win32-ia32-0.34.5.tgz",
      "integrity": "sha512-FV9m/7NmeCmSHDD5j4+4pNI8Cp3aW+JvLoXcTUo0IqyjSfAZJ8dIUmijx1qaJsIiU+Hosw6xM5KijAWRJCSgNg==",
      "cpu": [
        "ia32"
      ],
      "license": "Apache-2.0 AND LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-win32-x64": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-win32-x64/-/sharp-win32-x64-0.34.5.tgz",
      "integrity": "sha512-+29YMsqY2/9eFEiW93eqWnuLcWcufowXewwSNIT6UwZdUUCrM3oFjMWH/Z6/TMmb4hlFenmfAVbpWeup2jryCw==",
      "cpu": [
        "x64"
      ],
      "license": "Apache-2.0 AND LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@jridgewell/gen-mapping": {
      "version": "0.3.13",
      "resolved": "https://registry.npmjs.org/@jridgewell/gen-mapping/-/gen-mapping-0.3.13.tgz",
      "integrity": "sha512-2kkt/7niJ6MgEPxF0bYdQ6etZaA+fQvDcLKckhy1yIQOzaoKjBBjSj63/aLVjYE3qhRt5dvM+uUyfCg6UKCBbA==",
      "dev": true,
      "dependencies": {
        "@jridgewell/sourcemap-codec": "^1.5.0",
        "@jridgewell/trace-mapping": "^0.3.24"
      }
    },
    "node_modules/@jridgewell/remapping": {
      "version": "2.3.5",
      "resolved": "https://registry.npmjs.org/@jridgewell/remapping/-/remapping-2.3.5.tgz",
      "integrity": "sha512-LI9u/+laYG4Ds1TDKSJW2YPrIlcVYOwi2fUC6xB43lueCjgxV4lffOCZCtYFiH6TNOX+tQKXx97T4IKHbhyHEQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/gen-mapping": "^0.3.5",
        "@jridgewell/trace-mapping": "^0.3.24"
      }
    },
    "node_modules/@jridgewell/resolve-uri": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/@jridgewell/resolve-uri/-/resolve-uri-3.1.2.tgz",
      "integrity": "sha512-bRISgCIjP20/tbWSPWMEi54QVPRZExkuD9lJL+UIxUKtwVJA8wW1Trb1jMs1RFXo1CBTNZ/5hpC9QvmKWdopKw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@jridgewell/sourcemap-codec": {
      "version": "1.5.5",
      "resolved": "https://registry.npmjs.org/@jridgewell/sourcemap-codec/-/sourcemap-codec-1.5.5.tgz",
      "integrity": "sha512-cYQ9310grqxueWbl+WuIUIaiUaDcj7WOq5fVhEljNVgRfOUhY9fy2zTvfoqWsnebh8Sl70VScFbICvJnLKB0Og==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@jridgewell/trace-mapping": {
      "version": "0.3.31",
      "resolved": "https://registry.npmjs.org/@jridgewell/trace-mapping/-/trace-mapping-0.3.31.tgz",
      "integrity": "sha512-zzNR+SdQSDJzc8joaeP8QQoCQr8NuYx2dIIytl1QeBEZHJ9uW6hebsrYgbz8hJwUQao3TWCMtmfV8Nu1twOLAw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/resolve-uri": "^3.1.0",
        "@jridgewell/sourcemap-codec": "^1.4.14"
      }
    },
    "node_modules/@napi-rs/wasm-runtime": {
      "version": "1.1.5",
      "resolved": "https://registry.npmjs.org/@napi-rs/wasm-runtime/-/wasm-runtime-1.1.5.tgz",
      "integrity": "sha512-AWPoBRJ9tsnVhor4sjO7rkni+7p+2IAEFj6cx06UgP10jkQHqay/36uRV/bFkgrh18D9vb4cr8Q0Pthskgzy+Q==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "@tybys/wasm-util": "^0.10.2"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/Brooooooklyn"
      },
      "peerDependencies": {
        "@emnapi/core": "^1.7.1",
        "@emnapi/runtime": "^1.7.1"
      }
    },
    "node_modules/@next/env": {
      "version": "16.2.9",
      "resolved": "https://registry.npmjs.org/@next/env/-/env-16.2.9.tgz",
      "integrity": "sha512-ki5VxxXfzD/9TDe13wyeTKIjQTAwBVpnr8KhRDUr8ltMUq1/NBpWNT5tiPoxiGl+PHM4X2ahSOiPk6iAimIzPg==",
      "license": "MIT"
    },
    "node_modules/@next/eslint-plugin-next": {
      "version": "16.2.9",
      "resolved": "https://registry.npmjs.org/@next/eslint-plugin-next/-/eslint-plugin-next-16.2.9.tgz",
      "integrity": "sha512-UZi8+YT/MLgTC9nrrn2Xd4lBYv1B7lVmtWHfPcthAI5Tt/C1LuDe6DfmtCtJ+WQod3ksY4VrKSvk3oMVAnL7qw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fast-glob": "3.3.1"
      }
    },
    "node_modules/@next/swc-darwin-arm64": {
      "version": "16.2.9",
      "resolved": "https://registry.npmjs.org/@next/swc-darwin-arm64/-/swc-darwin-arm64-16.2.9.tgz",
      "integrity": "sha512-HkfxNYUCmcct0Xsqib5KxqMSHV4AHJq857BNRchyBDs4YS19aHzVfn1kDuBYKqLLQBjXgnkIsjV2Kd4d2wzYhw==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-darwin-x64": {
      "version": "16.2.9",
      "resolved": "https://registry.npmjs.org/@next/swc-darwin-x64/-/swc-darwin-x64-16.2.9.tgz",
      "integrity": "sha512-7IAtK4MeybpqRV9GRABWEhJ62mOS+rzWOzOTFie4cSEtm12xsoOMJRcECoZx3FHPzFAqN/IJtHqWAFOLfl152w==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-linux-arm64-gnu": {
      "version": "16.2.9",
      "resolved": "https://registry.npmjs.org/@next/swc-linux-arm64-gnu/-/swc-linux-arm64-gnu-16.2.9.tgz",
      "integrity": "sha512-hBD75iWpUtkL9SmQmcRhmLomn9jgkPzCEkbOcLgHymPEKzv+6ONy13RRiIEz/iEObjkS2Jlb5gYS2XGoS3X4rw==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-linux-arm64-musl": {
      "version": "16.2.9",
      "resolved": "https://registry.npmjs.org/@next/swc-linux-arm64-musl/-/swc-linux-arm64-musl-16.2.9.tgz",
      "integrity": "sha512-qZTI3pf9SGc/obr8NkQAekBxmp1QK+kVm+VAf3BALLfFAj+1kUhkTxmrWpVos9R/UYIA8AWX2p6cGI5WdwzVUA==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-linux-x64-gnu": {
      "version": "16.2.9",
      "resolved": "https://registry.npmjs.org/@next/swc-linux-x64-gnu/-/swc-linux-x64-gnu-16.2.9.tgz",
      "integrity": "sha512-xm0HfRNX+UkH4R3c18ynswjj5o5uEj/7iI9p9omdtTSIsRCzQqkGMA+10nzJ4EHnYC3as65IMhbbl5fWRUWHYg==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-linux-x64-musl": {
      "version": "16.2.9",
      "resolved": "https://registry.npmjs.org/@next/swc-linux-x64-musl/-/swc-linux-x64-musl-16.2.9.tgz",
      "integrity": "sha512-QumimHkGEG6vM3PfEDWKyKen03NcqLOkeKB1EfcPe7VxzmEiCa4jNnMyBn/US5zcd/VE1CI+O8Ovb3lfjVHfGw==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-win32-arm64-msvc": {
      "version": "16.2.9",
      "resolved": "https://registry.npmjs.org/@next/swc-win32-arm64-msvc/-/swc-win32-arm64-msvc-16.2.9.tgz",
      "integrity": "sha512-hzQpKZvw8rAwI6A2uQh6SacCSvNAXaIkPNsWwzqqfRiIMiXMfH936skDhz1OO6KpvdKkJrgHHtqQOq5PIXOvdQ==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-win32-x64-msvc": {
      "version": "16.2.9",
      "resolved": "https://registry.npmjs.org/@next/swc-win32-x64-msvc/-/swc-win32-x64-msvc-16.2.9.tgz",
      "integrity": "sha512-qr2VL3Ce5QrwgO2yh1ujSBawrimjVKX8FGF/cOynmdYKJY0BdHpGVNIRK1tqONB10Vkm25Ub1BD2bkjWs4+96w==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@nodelib/fs.scandir": {
      "version": "2.1.5",
      "resolved": "https://registry.npmjs.org/@nodelib/fs.scandir/-/fs.scandir-2.1.5.tgz",
      "integrity": "sha512-vq24Bq3ym5HEQm2NKCr3yXDwjc7vTsEThRDnkp2DK9p1uqLR+DHurm/NOTo0KG7HYHU7eppKZj3MyqYuMBf62g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@nodelib/fs.stat": "2.0.5",
        "run-parallel": "^1.1.9"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/@nodelib/fs.stat": {
      "version": "2.0.5",
      "resolved": "https://registry.npmjs.org/@nodelib/fs.stat/-/fs.stat-2.0.5.tgz",
      "integrity": "sha512-RkhPPp2zrqDAQA/2jNhnztcPAlv64XdhIp7a7454A5ovI7Bukxgt7MX7udwAu3zg1DcpPU0rz3VV1SeaqvY4+A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/@nodelib/fs.walk": {
      "version": "1.2.8",
      "resolved": "https://registry.npmjs.org/@nodelib/fs.walk/-/fs.walk-1.2.8.tgz",
      "integrity": "sha512-oGB+UxlgWcgQkgwo8GcEGwemoTFt3FIO9ababBmaGwXIoBKZ+GTy0pP185beGg7Llih/NSHSV2XAs1lnznocSg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@nodelib/fs.scandir": "2.1.5",
        "fastq": "^1.6.0"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/@nolyfill/is-core-module": {
      "version": "1.0.39",
      "resolved": "https://registry.npmjs.org/@nolyfill/is-core-module/-/is-core-module-1.0.39.tgz",
      "integrity": "sha512-nn5ozdjYQpUCZlWGuxcJY/KpxkWQs4DcbMCmKojjyrYDEAGy4Ce19NN4v5MduafTwJlbKc99UA8YhSVqq9yPZA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12.4.0"
      }
    },
    "node_modules/@reduxjs/toolkit": {
      "version": "2.12.0",
      "resolved": "https://registry.npmjs.org/@reduxjs/toolkit/-/toolkit-2.12.0.tgz",
      "integrity": "sha512-KiT+RzZbp6mQET+Mg+h2c97+9j1sNflUxQkIHI7Yuzf6Peu+OYpmkn6nbHWmLLWj+1ZODUJFwGZ7gx3L9R9EOw==",
      "license": "MIT",
      "dependencies": {
        "@standard-schema/spec": "^1.0.0",
        "@standard-schema/utils": "^0.3.0",
        "immer": "^11.0.0",
        "redux": "^5.0.1",
        "redux-thunk": "^3.1.0",
        "reselect": "^5.1.0"
      },
      "peerDependencies": {
        "react": "^16.9.0 || ^17.0.0 || ^18 || ^19",
        "react-redux": "^7.2.1 || ^8.1.3 || ^9.0.0"
      },
      "peerDependenciesMeta": {
        "react": {
          "optional": true
        },
        "react-redux": {
          "optional": true
        }
      }
    },
    "node_modules/@reduxjs/toolkit/node_modules/immer": {
      "version": "11.1.8",
      "resolved": "https://registry.npmjs.org/immer/-/immer-11.1.8.tgz",
      "integrity": "sha512-/tbkHMW7y10Lx6i1crLjD4/OhNkRG+Fo7byZHtah0547nIeXYcpIXaUh0IAQY6gO5459qpGGYapcEOHtFXkIuA==",
      "license": "MIT",
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/immer"
      }
    },
    "node_modules/@rtsao/scc": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/@rtsao/scc/-/scc-1.1.0.tgz",
      "integrity": "sha512-zt6OdqaDoOnJ1ZYsCYGt9YmWzDXl4vQdKTyJev62gFhRGKdx7mcT54V9KIjg+d2wi9EXsPvAPKe7i7WjfVWB8g==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@standard-schema/spec": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/@standard-schema/spec/-/spec-1.1.0.tgz",
      "integrity": "sha512-l2aFy5jALhniG5HgqrD6jXLi/rUWrKvqN/qJx6yoJsgKhblVd+iqqU4RCXavm/jPityDo5TCvKMnpjKnOriy0w==",
      "license": "MIT"
    },
    "node_modules/@standard-schema/utils": {
      "version": "0.3.0",
      "resolved": "https://registry.npmjs.org/@standard-schema/utils/-/utils-0.3.0.tgz",
      "integrity": "sha512-e7Mew686owMaPJVNNLs55PUvgz371nKgwsc4vxE49zsODpJEnxgxRo2y/OKrqueavXgZNMDVj3DdHFlaSAeU8g=="
    },
    "node_modules/@supabase/auth-js": {
      "version": "2.108.1",
      "resolved": "https://registry.npmjs.org/@supabase/auth-js/-/auth-js-2.108.1.tgz",
      "integrity": "sha512-Lle5rKU8f9LF3K5dDd8Or8mkkG+ptzRZZWKPVMm9B9UuovH65Ss2+iFnQqRsCqaGouvJEcTWyl0cj2riNrrDLQ==",
      "license": "MIT",
      "dependencies": {
        "tslib": "2.8.1"
      },
      "engines": {
        "node": ">=20.0.0"
      }
    },
    "node_modules/@supabase/functions-js": {
      "version": "2.108.1",
      "resolved": "https://registry.npmjs.org/@supabase/functions-js/-/functions-js-2.108.1.tgz",
      "integrity": "sha512-fxBRW/A4IG7ADQztVt0NaEy5ysiO1WJ2pbldsnBchrkHuyepX0Krek9qA9T4gUQBVVTCE9Ea4pdsM5hfn3nc4A==",
      "license": "MIT",
      "dependencies": {
        "tslib": "2.8.1"
      },
      "engines": {
        "node": ">=20.0.0"
      }
    },
    "node_modules/@supabase/phoenix": {
      "version": "0.4.2",
      "resolved": "https://registry.npmjs.org/@supabase/phoenix/-/phoenix-0.4.2.tgz",
      "integrity": "sha512-YSAGnmDAfuleFCVt3CeurQZAhxRfXWeZIIkwp7NhYzQ1UwW6ePSnzsFAiUm/mbCkfoCf70QQHKW/K6RKh52a4A==",
      "license": "MIT"
    },
    "node_modules/@supabase/postgrest-js": {
      "version": "2.108.1",
      "resolved": "https://registry.npmjs.org/@supabase/postgrest-js/-/postgrest-js-2.108.1.tgz",
      "integrity": "sha512-9lj2MCPPMgSTaJ5y+amnhb3TWPtMFVlbDn2hmX/VV91xQU4j0AauwfMaBErHBJ+zzsSwjc0jLU+zLIZFLQzfig==",
      "license": "MIT",
      "dependencies": {
        "tslib": "2.8.1"
      },
      "engines": {
        "node": ">=20.0.0"
      }
    },
    "node_modules/@supabase/realtime-js": {
      "version": "2.108.1",
      "resolved": "https://registry.npmjs.org/@supabase/realtime-js/-/realtime-js-2.108.1.tgz",
      "integrity": "sha512-mHGGqOjwd1XTydcoffUqEMsbFQHUi6A3uhQ0EXr3iqzpLqItxKA9nbN6gIQxrZ7JRRnuUe/iOFPUkYV9Tdc5lg==",
      "license": "MIT",
      "dependencies": {
        "@supabase/phoenix": "^0.4.2",
        "tslib": "2.8.1"
      },
      "engines": {
        "node": ">=20.0.0"
      }
    },
    "node_modules/@supabase/ssr": {
      "version": "0.12.0",
      "resolved": "https://registry.npmjs.org/@supabase/ssr/-/ssr-0.12.0.tgz",
      "integrity": "sha512-d9XV5XzJvzzZbeAIM7fWTCUYxQJZ2Ru6ny3dJHmHGp/LIrJ+o9FpD7N9Rf/UhhWEvHXSoDe8SI32Z2ouOdMjBg==",
      "license": "MIT",
      "dependencies": {
        "cookie": "^1.0.2"
      },
      "peerDependencies": {
        "@supabase/supabase-js": "^2.108.0"
      }
    },
    "node_modules/@supabase/storage-js": {
      "version": "2.108.1",
      "resolved": "https://registry.npmjs.org/@supabase/storage-js/-/storage-js-2.108.1.tgz",
      "integrity": "sha512-Er0SGGt85iT6ye+SSh98Az6L2CesoZJuyzEZYH2oBOAnIxa9Nn4CtwUC3veGxYggoT56X+3tVuuQeDBP8kR8sg==",
      "license": "MIT",
      "dependencies": {
        "iceberg-js": "^0.8.1",
        "tslib": "2.8.1"
      },
      "engines": {
        "node": ">=20.0.0"
      }
    },
    "node_modules/@supabase/supabase-js": {
      "version": "2.108.1",
      "resolved": "https://registry.npmjs.org/@supabase/supabase-js/-/supabase-js-2.108.1.tgz",
      "integrity": "sha512-V/1hRKLSCJ0zEL+9QFRBUtivvePfOsaAYQmC0HhFNSHC2F3xFs4jSF3YhkLmzex6E4V4FGvmBDOP72D/53NnZA==",
      "license": "MIT",
      "dependencies": {
        "@supabase/auth-js": "2.108.1",
        "@supabase/functions-js": "2.108.1",
        "@supabase/postgrest-js": "2.108.1",
        "@supabase/realtime-js": "2.108.1",
        "@supabase/storage-js": "2.108.1"
      },
      "engines": {
        "node": ">=20.0.0"
      }
    },
    "node_modules/@swc/helpers": {
      "version": "0.5.15",
      "resolved": "https://registry.npmjs.org/@swc/helpers/-/helpers-0.5.15.tgz",
      "integrity": "sha512-JQ5TuMi45Owi4/BIMAJBoSQoOJu12oOk/gADqlcUL9JEdHB8vyjUSsxqeNXnmXHjYKMi2WcYtezGEEhqUI/E2g==",
      "license": "Apache-2.0",
      "dependencies": {
        "tslib": "^2.8.0"
      }
    },
    "node_modules/@tybys/wasm-util": {
      "version": "0.10.2",
      "resolved": "https://registry.npmjs.org/@tybys/wasm-util/-/wasm-util-0.10.2.tgz",
      "integrity": "sha512-RoBvJ2X0wuKlWFIjrwffGw1IqZHKQqzIchKaadZZfnNpsAYp2mM0h36JtPCjNDAHGgYez/15uMBpfGwchhiMgg==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@types/d3-array": {
      "version": "3.2.2",
      "resolved": "https://registry.npmjs.org/@types/d3-array/-/d3-array-3.2.2.tgz",
      "integrity": "sha512-hOLWVbm7uRza0BYXpIIW5pxfrKe0W+D5lrFiAEYR+pb6w3N2SwSMaJbXdUfSEv+dT4MfHBLtn5js0LAWaO6otw==",
      "license": "MIT"
    },
    "node_modules/@types/d3-color": {
      "version": "3.1.3",
      "resolved": "https://registry.npmjs.org/@types/d3-color/-/d3-color-3.1.3.tgz",
      "integrity": "sha512-iO90scth9WAbmgv7ogoq57O9YpKmFBbmoEoCHDB2xMBY0+/KVrqAaCDyCE16dUspeOvIxFFRI+0sEtqDqy2b4A==",
      "license": "MIT"
    },
    "node_modules/@types/d3-ease": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/@types/d3-ease/-/d3-ease-3.0.2.tgz",
      "integrity": "sha512-NcV1JjO5oDzoK26oMzbILE6HW7uVXOHLQvHshBUW4UMdZGfiY6v5BeQwh9a9tCzv+CeefZQHJt5SRgK154RtiA==",
      "license": "MIT"
    },
    "node_modules/@types/d3-interpolate": {
      "version": "3.0.4",
      "resolved": "https://registry.npmjs.org/@types/d3-interpolate/-/d3-interpolate-3.0.4.tgz",
      "integrity": "sha512-mgLPETlrpVV1YRJIglr4Ez47g7Yxjl1lj7YKsiMCb27VJH9W8NVM6Bb9d8kkpG/uAQS5AmbA48q2IAolKKo1MA==",
      "license": "MIT",
      "dependencies": {
        "@types/d3-color": "*"
      }
    },
    "node_modules/@types/d3-path": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/@types/d3-path/-/d3-path-3.1.1.tgz",
      "integrity": "sha512-VMZBYyQvbGmWyWVea0EHs/BwLgxc+MKi1zLDCONksozI4YJMcTt8ZEuIR4Sb1MMTE8MMW49v0IwI5+b7RmfWlg==",
      "license": "MIT"
    },
    "node_modules/@types/d3-scale": {
      "version": "4.0.9",
      "resolved": "https://registry.npmjs.org/@types/d3-scale/-/d3-scale-4.0.9.tgz",
      "integrity": "sha512-dLmtwB8zkAeO/juAMfnV+sItKjlsw2lKdZVVy6LRr0cBmegxSABiLEpGVmSJJ8O08i4+sGR6qQtb6WtuwJdvVw==",
      "license": "MIT",
      "dependencies": {
        "@types/d3-time": "*"
      }
    },
    "node_modules/@types/d3-shape": {
      "version": "3.1.8",
      "resolved": "https://registry.npmjs.org/@types/d3-shape/-/d3-shape-3.1.8.tgz",
      "integrity": "sha512-lae0iWfcDeR7qt7rA88BNiqdvPS5pFVPpo5OfjElwNaT2yyekbM0C9vK+yqBqEmHr6lDkRnYNoTBYlAgJa7a4w==",
      "license": "MIT",
      "dependencies": {
        "@types/d3-path": "*"
      }
    },
    "node_modules/@types/d3-time": {
      "version": "3.0.4",
      "resolved": "https://registry.npmjs.org/@types/d3-time/-/d3-time-3.0.4.tgz",
      "integrity": "sha512-yuzZug1nkAAaBlBBikKZTgzCeA+k1uy4ZFwWANOfKw5z5LRhV0gNA7gNkKm7HoK+HRN0wX3EkxGk0fpbWhmB7g==",
      "license": "MIT"
    },
    "node_modules/@types/d3-timer": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/@types/d3-timer/-/d3-timer-3.0.2.tgz",
      "integrity": "sha512-Ps3T8E8dZDam6fUyNiMkekK3XUsaUEik+idO9/YjPtfj2qruF8tFBXS7XhtE4iIXBLxhmLjP3SXpLhVf21I9Lw==",
      "license": "MIT"
    },
    "node_modules/@types/estree": {
      "version": "1.0.9",
      "resolved": "https://registry.npmjs.org/@types/estree/-/estree-1.0.9.tgz",
      "integrity": "sha512-GhdPgy1el4/ImP05X05Uw4cw2/M93BCUmnEvWZNStlCzEKME4Fkk+YpoA5OiHNQmoS7Cafb8Xa3Pya8m1Qrzeg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/json-schema": {
      "version": "7.0.15",
      "resolved": "https://registry.npmjs.org/@types/json-schema/-/json-schema-7.0.15.tgz",
      "integrity": "sha512-5+fP8P8MFNC+AyZCDxrB2pkZFPGzqQWUzpSeuuVLvm8VMcorNYavBqoFcxK8bQz4Qsbn4oUEEem4wDLfcysGHA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/json5": {
      "version": "0.0.29",
      "resolved": "https://registry.npmjs.org/@types/json5/-/json5-0.0.29.tgz",
      "integrity": "sha512-dRLjCWHYg4oaA77cxO64oO+7JwCwnIzkZPdrrC71jQmQtlhM556pwKo5bUzqvZndkVbeFLIIi+9TC40JNF5hNQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/node": {
      "version": "20.19.43",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-20.19.43.tgz",
      "integrity": "sha512-6oYBAi5ikg4Pl+kGsoYtawUMBT2zZMCvPNF7pVLnHZfd1zf38DRiWn/gT01RYCdUqkv7Fhr+C9ot4/tb+2sVvA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "undici-types": "~6.21.0"
      }
    },
    "node_modules/@types/react": {
      "version": "19.2.17",
      "resolved": "https://registry.npmjs.org/@types/react/-/react-19.2.17.tgz",
      "integrity": "sha512-MXfmqaVPEVgkBT/aY0aGCkRWWtByiYQXo3xdQ8r5RzuFrPiRn8Gar2tQdXSUQ2GKV3bkXckek89V8wQBY2Q/Aw==",
      "devOptional": true,
      "license": "MIT",
      "dependencies": {
        "csstype": "^3.2.2"
      }
    },
    "node_modules/@types/react-dom": {
      "version": "19.2.3",
      "resolved": "https://registry.npmjs.org/@types/react-dom/-/react-dom-19.2.3.tgz",
      "integrity": "sha512-jp2L/eY6fn+KgVVQAOqYItbF0VY/YApe5Mz2F0aykSO8gx31bYCZyvSeYxCHKvzHG5eZjc+zyaS5BrBWya2+kQ==",
      "dev": true,
      "license": "MIT",
      "peerDependencies": {
        "@types/react": "^19.2.0"
      }
    },
    "node_modules/@types/use-sync-external-store": {
      "version": "0.0.6",
      "resolved": "https://registry.npmjs.org/@types/use-sync-external-store/-/use-sync-external-store-0.0.6.tgz",
      "integrity": "sha512-zFDAD+tlpf2r4asuHEj0XH6pY6i0g5NeAHPn+15wk3BV6JA69eERFXC1gyGThDkVa1zCyKr5jox1+2LbV/AMLg==",
      "license": "MIT"
    },
    "node_modules/@typescript-eslint/eslint-plugin": {
      "version": "8.61.0",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/eslint-plugin/-/eslint-plugin-8.61.0.tgz",
      "integrity": "sha512-bFNvl9ZczlVb+wR2Akszf3gHfKVj/8WanXaGJ3UstTA7brNKg0cNdk6X1Psu5V7MZ2oQtzZKOEzIUehaoxbDGw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@eslint-community/regexpp": "^4.12.2",
        "@typescript-eslint/scope-manager": "8.61.0",
        "@typescript-eslint/type-utils": "8.61.0",
        "@typescript-eslint/utils": "8.61.0",
        "@typescript-eslint/visitor-keys": "8.61.0",
        "ignore": "^7.0.5",
        "natural-compare": "^1.4.0",
        "ts-api-utils": "^2.5.0"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      },
      "peerDependencies": {
        "@typescript-eslint/parser": "^8.61.0",
        "eslint": "^8.57.0 || ^9.0.0 || ^10.0.0",
        "typescript": ">=4.8.4 <6.1.0"
      }
    },
    "node_modules/@typescript-eslint/eslint-plugin/node_modules/ignore": {
      "version": "7.0.5",
      "resolved": "https://registry.npmjs.org/ignore/-/ignore-7.0.5.tgz",
      "integrity": "sha512-Hs59xBNfUIunMFgWAbGX5cq6893IbWg4KnrjbYwX3tx0ztorVgTDA6B2sxf8ejHJ4wz8BqGUMYlnzNBer5NvGg==",
      "dev": true,
      "engines": {
        "node": ">= 4"
      }
    },
    "node_modules/@typescript-eslint/parser": {
      "version": "8.61.0",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/parser/-/parser-8.61.0.tgz",
      "integrity": "sha512-5B7PfA2e1NQGCnDHd/0lW7W3gvp3d59Ryw54FYO8Uswxo9f6ikw3AZV+Xj/TvpImmpsiYyUqAfhC6kJID1jF6w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@typescript-eslint/scope-manager": "8.61.0",
        "@typescript-eslint/types": "8.61.0",
        "@typescript-eslint/typescript-estree": "8.61.0",
        "@typescript-eslint/visitor-keys": "8.61.0",
        "debug": "^4.4.3"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      },
      "peerDependencies": {
        "eslint": "^8.57.0 || ^9.0.0 || ^10.0.0",
        "typescript": ">=4.8.4 <6.1.0"
      }
    },
    "node_modules/@typescript-eslint/project-service": {
      "version": "8.61.0",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/project-service/-/project-service-8.61.0.tgz",
      "integrity": "sha512-DV42F7MLJO6Rax7SK1yg43tcnEfGUrurSpSxKuVX+a3RCTzBlH3fuxprrOJXKCJGAaw82xXocikJ0uQaqwXgGA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@typescript-eslint/tsconfig-utils": "^8.61.0",
        "@typescript-eslint/types": "^8.61.0",
        "debug": "^4.4.3"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      },
      "peerDependencies": {
        "typescript": ">=4.8.4 <6.1.0"
      }
    },
    "node_modules/@typescript-eslint/scope-manager": {
      "version": "8.61.0",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/scope-manager/-/scope-manager-8.61.0.tgz",
      "integrity": "sha512-IWdXFHFSb6mlC3HPc7QsLDm5zYEbUla6trDEHf32D3/dnuUyXd87plScSNXSbm0/RxMvObpI17sv/EDTGrGZkA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@typescript-eslint/types": "8.61.0",
        "@typescript-eslint/visitor-keys": "8.61.0"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      }
    },
    "node_modules/@typescript-eslint/tsconfig-utils": {
      "version": "8.61.0",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/tsconfig-utils/-/tsconfig-utils-8.61.0.tgz",
      "integrity": "sha512-O5Amvdv9ztMpxpf+vmFULGG78IE6Qwdr3bCGvqwG4nwc9H2qXkOYJJnRbRHyMkQTjv1d03olqwwwzHLMqpFePQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      },
      "peerDependencies": {
        "typescript": ">=4.8.4 <6.1.0"
      }
    },
    "node_modules/@typescript-eslint/type-utils": {
      "version": "8.61.0",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/type-utils/-/type-utils-8.61.0.tgz",
      "integrity": "sha512-TuBiQYIkd97yBfInHCTKVYMbX4kvEmpOEuixIuzCU9p8BGT1SfyyO0d0IfDMbPIHcjn/hWnusUX5e8v5Xg+X8A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@typescript-eslint/types": "8.61.0",
        "@typescript-eslint/typescript-estree": "8.61.0",
        "@typescript-eslint/utils": "8.61.0",
        "debug": "^4.4.3",
        "ts-api-utils": "^2.5.0"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      },
      "peerDependencies": {
        "eslint": "^8.57.0 || ^9.0.0 || ^10.0.0",
        "typescript": ">=4.8.4 <6.1.0"
      }
    },
    "node_modules/@typescript-eslint/types": {
      "version": "8.61.0",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/types/-/types-8.61.0.tgz",
      "integrity": "sha512-9QTQpZ5Iin4CdIodfbDQFSeiSJKidgYJYug1P9CC2xWgUTvlmixViqDZNciMjwLBZyJnG4tGmPl97rVAFb1AJg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      }
    },
    "node_modules/@typescript-eslint/typescript-estree": {
      "version": "8.61.0",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/typescript-estree/-/typescript-estree-8.61.0.tgz",
      "integrity": "sha512-42zatd5qSvvcV1JdDBCLxYRznvP4eIHpPoZXdkPFnAmanA4FuZ5dibSnCBggY8hQnqajPpoGjXFdZ7fIJKQnlA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@typescript-eslint/project-service": "8.61.0",
        "@typescript-eslint/tsconfig-utils": "8.61.0",
        "@typescript-eslint/types": "8.61.0",
        "@typescript-eslint/visitor-keys": "8.61.0",
        "debug": "^4.4.3",
        "minimatch": "^10.2.2",
        "semver": "^7.7.3",
        "tinyglobby": "^0.2.15",
        "ts-api-utils": "^2.5.0"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      },
      "peerDependencies": {
        "typescript": ">=4.8.4 <6.1.0"
      }
    },
    "node_modules/@typescript-eslint/typescript-estree/node_modules/balanced-match": {
      "version": "4.0.4",
      "resolved": "https://registry.npmjs.org/balanced-match/-/balanced-match-4.0.4.tgz",
      "integrity": "sha512-BLrgEcRTwX2o6gGxGOCNyMvGSp35YofuYzw9h1IMTRmKqttAZZVU67bdb9Pr2vUHA8+j3i2tJfjO6C6+4myGTA==",
      "dev": true,
      "engines": {
        "node": "18 || 20 || >=22"
      }
    },
    "node_modules/@typescript-eslint/typescript-estree/node_modules/brace-expansion": {
      "version": "5.0.6",
      "resolved": "https://registry.npmjs.org/brace-expansion/-/brace-expansion-5.0.6.tgz",
      "integrity": "sha512-kLpxurY4Z4r9sgMsyG0Z9uzsBlgiU/EFKhj/h91/8yHu0edo7XuixOIH3VcJ8kkxs6/jPzoI6U9Vj3WqbMQ94g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "balanced-match": "^4.0.2"
      },
      "engines": {
        "node": "18 || 20 || >=22"
      }
    },
    "node_modules/@typescript-eslint/typescript-estree/node_modules/minimatch": {
      "version": "10.2.5",
      "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-10.2.5.tgz",
      "integrity": "sha512-MULkVLfKGYDFYejP07QOurDLLQpcjk7Fw+7jXS2R2czRQzR56yHRveU5NDJEOviH+hETZKSkIk5c+T23GjFUMg==",
      "dev": true,
      "license": "BlueOak-1.0.0",
      "dependencies": {
        "brace-expansion": "^5.0.5"
      },
      "engines": {
        "node": "18 || 20 || >=22"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/@typescript-eslint/utils": {
      "version": "8.61.0",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/utils/-/utils-8.61.0.tgz",
      "integrity": "sha512-3bzFt7ImFMW/jVYwJamDoe/dMOdFLSC6pom6rRjdh4SZJEYupyMzem8e7vKZLclLfpHjlwSAXOUxtKxGXUiLqA==",
      "dev": true,
      "dependencies": {
        "@eslint-community/eslint-utils": "^4.9.1",
        "@typescript-eslint/scope-manager": "8.61.0",
        "@typescript-eslint/types": "8.61.0",
        "@typescript-eslint/typescript-estree": "8.61.0"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      },
      "peerDependencies": {
        "eslint": "^8.57.0 || ^9.0.0 || ^10.0.0",
        "typescript": ">=4.8.4 <6.1.0"
      }
    },
    "node_modules/@typescript-eslint/visitor-keys": {
      "version": "8.61.0",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/visitor-keys/-/visitor-keys-8.61.0.tgz",
      "integrity": "sha512-QVLZu3ZPQEE+HICQyAMZ2yLQhxf0meY/wx6Hx14YcTNj13JB3qHlX3lJ02L3fLGHgERRH71kvYDwiXIguT3AjQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@typescript-eslint/types": "8.61.0",
        "eslint-visitor-keys": "^5.0.0"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      }
    },
    "node_modules/@typescript-eslint/visitor-keys/node_modules/eslint-visitor-keys": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/eslint-visitor-keys/-/eslint-visitor-keys-5.0.1.tgz",
      "integrity": "sha512-tD40eHxA35h0PEIZNeIjkHoDR4YjjJp34biM0mDvplBe//mB+IHCqHDGV7pxF+7MklTvighcCPPZC7ynWyjdTA==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": "^20.19.0 || ^22.13.0 || >=24"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/@unrs/resolver-binding-android-arm-eabi": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-android-arm-eabi/-/resolver-binding-android-arm-eabi-1.12.2.tgz",
      "integrity": "sha512-g5T90pqg1bo/7mytQx6F4iBNC0Wsh9cu+z9veDbFjc7HjpesJFWD7QMS0NGStXM075+7dJPPVvBbpZlnrdpi/w==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ]
    },
    "node_modules/@unrs/resolver-binding-android-arm64": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-android-arm64/-/resolver-binding-android-arm64-1.12.2.tgz",
      "integrity": "sha512-YGCRZv/9GLhwmz6mYDeTsm/92BAyR28l6c2ReweVW5pWgfsitWLY8upvfRlGdoyD8HjeTHSYJWyZGD4KJA/nFQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ]
    },
    "node_modules/@unrs/resolver-binding-darwin-arm64": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-darwin-arm64/-/resolver-binding-darwin-arm64-1.12.2.tgz",
      "integrity": "sha512-u9DiNT1auQMO20A9SyTuG3wUgQWB9Z7KjAg0uFuCDR1FsAY8A0CG2S6JpHS1xwm/w1G08bjXZDcyOCjv1WAm2w==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ]
    },
    "node_modules/@unrs/resolver-binding-darwin-x64": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-darwin-x64/-/resolver-binding-darwin-x64-1.12.2.tgz",
      "integrity": "sha512-f7rPLi/T1HVKZu/u6t87lroib16n8vrSzcyxI7lg4BGO9UF26KhQL44sd9eOUgrTYhvRXtWOIZT5PejdPyJfUA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ]
    },
    "node_modules/@unrs/resolver-binding-freebsd-x64": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-freebsd-x64/-/resolver-binding-freebsd-x64-1.12.2.tgz",
      "integrity": "sha512-BpcOjWCJub6nRZUS2zA20pmLvjtqAtGejETaIyRLiZiQf++cbrjltLA5NN/xaXfqeOBOSlMFbemIl5/S5tljmg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-arm-gnueabihf": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-arm-gnueabihf/-/resolver-binding-linux-arm-gnueabihf-1.12.2.tgz",
      "integrity": "sha512-vZTDvdSISZjJx66OzJqtsOhzifbqRjbmI1Mnu49fQDwog5GtDI4QidRiEAYbZCRj9C8YZEW+3ZjqsyS9GR4k2A==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-arm-musleabihf": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-arm-musleabihf/-/resolver-binding-linux-arm-musleabihf-1.12.2.tgz",
      "integrity": "sha512-BiPI+IrIlwcW4nLLMM21+B1dFPzd55yAVgVGrdgDjNef+ch03GdxrcyaIz8X9SsQirh/kCQ7mviyWlMxdh2D7g==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-arm64-gnu": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-arm64-gnu/-/resolver-binding-linux-arm64-gnu-1.12.2.tgz",
      "integrity": "sha512-zJc0H99FEPoFfSrNpa91HYfxzfAJCr502oxNK1cfdC9hlaFI43RT+JFCann9JUgZmLzzntChHyn13Sgn9ljHNg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-arm64-musl": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-arm64-musl/-/resolver-binding-linux-arm64-musl-1.12.2.tgz",
      "integrity": "sha512-KQ3Lki6l+Pz1k/eBipN41ES+YUK30beLGb9YqcB1O542cyLCNE6GaxrfcY3T6EezmGGk84wb5XyO9loTM9tkcA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-loong64-gnu": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-loong64-gnu/-/resolver-binding-linux-loong64-gnu-1.12.2.tgz",
      "integrity": "sha512-3SJGEh1DborhG6pyxvhPzCT4bbSIVihsvgJc13P1bHG7KLdNDaF9T3gsTwFc7Jw/5Y5/iWOjkEx7Zy0NvCGX3Q==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-loong64-musl": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-loong64-musl/-/resolver-binding-linux-loong64-musl-1.12.2.tgz",
      "integrity": "sha512-jiuG/Obbel7uw1PwHNFfrkiKhLAF6mnyZ6aWlOAVN9WqKm8v0OFGnciJIHu8+CMvXLQ8AD51LPzAoUfT21D5Ew==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-ppc64-gnu": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-ppc64-gnu/-/resolver-binding-linux-ppc64-gnu-1.12.2.tgz",
      "integrity": "sha512-q7xRvVpmcfeL+LlZg8Pbbo6QaTZwDU5BaGZbwfhkEsXJn3Was8xYfE0RBH266xZt0rM6B7i8xAYIvjthuUIWHg==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-riscv64-gnu": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-riscv64-gnu/-/resolver-binding-linux-riscv64-gnu-1.12.2.tgz",
      "integrity": "sha512-0CVdx6lcnT3Q9inOH8tsMIOJ6ImndllMjqJHg8RLVdB7Vq4SfkEXl9mCSsVNuNA4MCYycRicCUxPCabVHJRr6A==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-riscv64-musl": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-riscv64-musl/-/resolver-binding-linux-riscv64-musl-1.12.2.tgz",
      "integrity": "sha512-iOwlRo9vnp6R6ohHQS11n0NnfdXx/omhkocmIfaPRpQhKZ+3BDMkkdRVh53qjkFkpPddf+FETA28NwGN7l5l+w==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-s390x-gnu": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-s390x-gnu/-/resolver-binding-linux-s390x-gnu-1.12.2.tgz",
      "integrity": "sha512-HYJtLfXq94q8iZNFT1lknx258wlkkWhZeUXJRqzKBBUJ00CvZ+N33zgbCqimLjsyw5Va6uUxhVa12mI+kaveEw==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-x64-gnu": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-x64-gnu/-/resolver-binding-linux-x64-gnu-1.12.2.tgz",
      "integrity": "sha512-mPsUhunKKDih5O96Y6enDQyHc1SqBPlY1E/SfMWDM3EdJ95Z9CArPeCVwCCqbP45ljvivdEk8Fxn+SIb1rDAJQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-x64-musl": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-x64-musl/-/resolver-binding-linux-x64-musl-1.12.2.tgz",
      "integrity": "sha512-azrt6+5ydLd8Vt210AAFis/lZevSfPw93EJRIJG+xPu4WCJ8K0kppCTpMyLPcKT7H15M4Jnt2tMp5bOvCkRC6A==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-openharmony-arm64": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-openharmony-arm64/-/resolver-binding-openharmony-arm64-1.12.2.tgz",
      "integrity": "sha512-YZ9hP4O0X9PQb8eO980qmLNGH4zT3I9+SZTdt0Pr0YyuGQhYKoOZkV02VzrzyOZJ5xIJ3UFIenKkUkGg8GjgWQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openharmony"
      ]
    },
    "node_modules/@unrs/resolver-binding-wasm32-wasi": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-wasm32-wasi/-/resolver-binding-wasm32-wasi-1.12.2.tgz",
      "integrity": "sha512-tYFDIkMxSflfEc/h92ZWNsZlHSwgimbNHSO3PL2JWQHfCuC2q316jMyYU9TIWZsFK2bQwyK5VAdYgn8ygPj69A==",
      "cpu": [
        "wasm32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "@emnapi/core": "1.10.0",
        "@emnapi/runtime": "1.10.0",
        "@napi-rs/wasm-runtime": "^1.1.4"
      },
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/@unrs/resolver-binding-wasm32-wasi/node_modules/@emnapi/runtime": {
      "version": "1.10.0",
      "resolved": "https://registry.npmjs.org/@emnapi/runtime/-/runtime-1.10.0.tgz",
      "integrity": "sha512-ewvYlk86xUoGI0zQRNq/mC+16R1QeDlKQy21Ki3oSYXNgLb45GV1P6A0M+/s6nyCuNDqe5VpaY84BzXGwVbwFA==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@unrs/resolver-binding-win32-arm64-msvc": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-win32-arm64-msvc/-/resolver-binding-win32-arm64-msvc-1.12.2.tgz",
      "integrity": "sha512-qzNyg3xL0VPQmCaUh+N5jSitce6k+uCBfMDesWRnlULOZaqUkaJ0ybdT+UqlAWJoQjuqfIU/0Ptx9bteN4D82g==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@unrs/resolver-binding-win32-ia32-msvc": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-win32-ia32-msvc/-/resolver-binding-win32-ia32-msvc-1.12.2.tgz",
      "integrity": "sha512-WD9sY00OfpHVGfsnHZoA8jVT+esS/Bg8z8jzxp5BnDCjjwsuKsPQrzswwpFy4J1AUJbXPRfkpcX0mXrzeXW79g==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@unrs/resolver-binding-win32-x64-msvc": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-win32-x64-msvc/-/resolver-binding-win32-x64-msvc-1.12.2.tgz",
      "integrity": "sha512-nAB74NfSNKknqQ1RrYj6uz8FcXEomu/MATJZxh/x+BArzN2U3JbOYC0APYzUIGhVY3m5hRxA8VPNdPBoG8txlA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/acorn": {
      "version": "8.17.0",
      "resolved": "https://registry.npmjs.org/acorn/-/acorn-8.17.0.tgz",
      "integrity": "sha512-xRQbDb9BnwDafYNn6Vwl839DYVjqXYb1XVGtWAZ1kcDc6iwAL4hg3B1dZlRiuENFeO2H53gFG3in621AdERVAg==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "acorn": "bin/acorn"
      },
      "engines": {
        "node": ">=0.4.0"
      }
    },
    "node_modules/acorn-jsx": {
      "version": "5.3.2",
      "resolved": "https://registry.npmjs.org/acorn-jsx/-/acorn-jsx-5.3.2.tgz",
      "integrity": "sha512-rq9s+JNhf0IChjtDXxllJ7g41oZk5SlXtp0LHwyA5cejwn7vKmKp4pPri6YEePv2PU65sAsegbXtIinmDFDXgQ==",
      "dev": true,
      "license": "MIT",
      "peerDependencies": {
        "acorn": "^6.0.0 || ^7.0.0 || ^8.0.0"
      }
    },
    "node_modules/ajv": {
      "version": "6.15.0",
      "resolved": "https://registry.npmjs.org/ajv/-/ajv-6.15.0.tgz",
      "integrity": "sha512-fgFx7Hfoq60ytK2c7DhnF8jIvzYgOMxfugjLOSMHjLIPgenqa7S7oaagATUq99mV6IYvN2tRmC0wnTYX6iPbMw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fast-deep-equal": "^3.1.1",
        "fast-json-stable-stringify": "^2.0.0",
        "json-schema-traverse": "^0.4.1",
        "uri-js": "^4.2.2"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/epoberezkin"
      }
    },
    "node_modules/ansi-styles": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-4.3.0.tgz",
      "integrity": "sha512-zbB9rCJAT1rbjiVDb2hqKFHNYLxgtk8NURxZ3IZwD3F6NtxbXZQCnnSi1Lkx+IDohdPlFp222wVALIheZJQSEg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "color-convert": "^2.0.1"
      },
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/chalk/ansi-styles?sponsor=1"
      }
    },
    "node_modules/any-promise": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/any-promise/-/any-promise-1.3.0.tgz",
      "integrity": "sha512-7UvmKalWRt1wgjL1RrGxoSJW/0QZFIegpeGvZG9kjp8vrRu55XTHbwnqq2GpXm9uLbcuhxm3IqX9OB4MZR1b2A==",
      "dev": true
    },
    "node_modules/anymatch": {
      "version": "3.1.3",
      "resolved": "https://registry.npmjs.org/anymatch/-/anymatch-3.1.3.tgz",
      "integrity": "sha512-KMReFUr0B4t+D+OBkjR3KYqvocp2XaSzO55UcB6mgQMd3KbcE+mWTyvVV7D/zsdEbNnV6acZUutkiHQXvTr1Rw==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "normalize-path": "^3.0.0",
        "picomatch": "^2.0.4"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/arg": {
      "version": "5.0.2",
      "resolved": "https://registry.npmjs.org/arg/-/arg-5.0.2.tgz",
      "integrity": "sha512-PYjyFOLKQ9y57JvQ6QLo8dAgNqswh8M1RMJYdQduT6xbWSgK36P/Z/v+p888pM69jMMfS8Xd8F6I1kQ/I9HUGg==",
      "dev": true
    },
    "node_modules/argparse": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/argparse/-/argparse-2.0.1.tgz",
      "integrity": "sha512-8+9WqebbFzpX9OR+Wa6O29asIogeRMzcGtAINdpMHHyAg10f05aSFVBbcEqGf/PXw1EjAZ+q2/bEBg3DvurK3Q==",
      "dev": true,
      "license": "Python-2.0"
    },
    "node_modules/aria-query": {
      "version": "5.3.2",
      "resolved": "https://registry.npmjs.org/aria-query/-/aria-query-5.3.2.tgz",
      "integrity": "sha512-COROpnaoap1E2F000S62r6A60uHZnmlvomhfyT2DlTcrY1OrBKn2UhH7qn5wTC9zMvD0AY7csdPSNwKP+7WiQw==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/array-buffer-byte-length": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/array-buffer-byte-length/-/array-buffer-byte-length-1.0.2.tgz",
      "integrity": "sha512-LHE+8BuR7RYGDKvnrmcuSq3tDcKv9OFEXQt/HpbZhY7V6h0zlUXutnAD82GiFx9rdieCMjkvtcsPqBwgUl1Iiw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "is-array-buffer": "^3.0.5"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/array-includes": {
      "version": "3.1.9",
      "resolved": "https://registry.npmjs.org/array-includes/-/array-includes-3.1.9.tgz",
      "integrity": "sha512-FmeCCAenzH0KH381SPT5FZmiA/TmpndpcaShhfgEN9eCVjnFBqq3l1xrI42y8+PPLI6hypzou4GXw00WHmPBLQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "call-bound": "^1.0.4",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.24.0",
        "es-object-atoms": "^1.1.1",
        "get-intrinsic": "^1.3.0",
        "is-string": "^1.1.1",
        "math-intrinsics": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/array.prototype.findlast": {
      "version": "1.2.5",
      "resolved": "https://registry.npmjs.org/array.prototype.findlast/-/array.prototype.findlast-1.2.5.tgz",
      "integrity": "sha512-CVvd6FHg1Z3POpBLxO6E6zr+rSKEQ9L6rZHAaY7lLfhKsWYUBBOuMs0e9o24oopj6H+geRCX0YJ+TJLBK2eHyQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.7",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.2",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.0.0",
        "es-shim-unscopables": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/array.prototype.findlastindex": {
      "version": "1.2.6",
      "resolved": "https://registry.npmjs.org/array.prototype.findlastindex/-/array.prototype.findlastindex-1.2.6.tgz",
      "integrity": "sha512-F/TKATkzseUExPlfvmwQKGITM3DGTK+vkAsCZoDc5daVygbJBnjEUCbgkAvVFsgfXfX4YIqZ/27G3k3tdXrTxQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "call-bound": "^1.0.4",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.9",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.1.1",
        "es-shim-unscopables": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/array.prototype.flat": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/array.prototype.flat/-/array.prototype.flat-1.3.3.tgz",
      "integrity": "sha512-rwG/ja1neyLqCuGZ5YYrznA62D4mZXg0i1cIskIUKSiqF3Cje9/wXAls9B9s1Wa2fomMsIv8czB8jZcPmxCXFg==",
      "dev": true,
      "dependencies": {
        "call-bind": "^1.0.8",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.5",
        "es-shim-unscopables": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/array.prototype.flatmap": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/array.prototype.flatmap/-/array.prototype.flatmap-1.3.3.tgz",
      "integrity": "sha512-Y7Wt51eKJSyi80hFrJCePGGNo5ktJCslFuboqJsbf57CCPcm5zztluPlc4/aD8sWsKvlwatezpV4U1efk8kpjg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.5",
        "es-shim-unscopables": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/array.prototype.tosorted": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/array.prototype.tosorted/-/array.prototype.tosorted-1.1.4.tgz",
      "integrity": "sha512-p6Fx8B7b7ZhL/gmUsAy0D15WhvDccw3mnGNbZpi3pmeJdxtWsj2jEaI4Y6oo3XiHfzuSgPwKc04MYt6KgvC/wA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.7",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.3",
        "es-errors": "^1.3.0",
        "es-shim-unscopables": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/arraybuffer.prototype.slice": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/arraybuffer.prototype.slice/-/arraybuffer.prototype.slice-1.0.4.tgz",
      "integrity": "sha512-BNoCY6SXXPQ7gF2opIP4GBE+Xw7U+pHMYKuzjgCN3GwiaIR09UUeKfheyIry77QtrCBlC0KK0q5/TER/tYh3PQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "array-buffer-byte-length": "^1.0.1",
        "call-bind": "^1.0.8",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.5",
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.6",
        "is-array-buffer": "^3.0.4"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/ast-types-flow": {
      "version": "0.0.8",
      "resolved": "https://registry.npmjs.org/ast-types-flow/-/ast-types-flow-0.0.8.tgz",
      "integrity": "sha512-OH/2E5Fg20h2aPrbe+QL8JZQFko0YZaF+j4mnQ7BGhfavO7OpSLa8a0y9sBwomHdSbkhTS8TQNayBfnW5DwbvQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/async-function": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/async-function/-/async-function-1.0.0.tgz",
      "integrity": "sha512-hsU18Ae8CDTR6Kgu9DYf0EbCr/a5iGL0rytQDobUcdpYOKokk8LEjVphnXkDkgpi0wYVsqrXuP0bZxJaTqdgoA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/autoprefixer": {
      "version": "10.5.0",
      "resolved": "https://registry.npmjs.org/autoprefixer/-/autoprefixer-10.5.0.tgz",
      "integrity": "sha512-FMhOoZV4+qR6aTUALKX2rEqGG+oyATvwBt9IIzVR5rMa2HRWPkxf+P+PAJLD1I/H5/II+HuZcBJYEFBpq39ong==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/autoprefixer"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "browserslist": "^4.28.2",
        "caniuse-lite": "^1.0.30001787",
        "fraction.js": "^5.3.4",
        "picocolors": "^1.1.1",
        "postcss-value-parser": "^4.2.0"
      },
      "bin": {
        "autoprefixer": "bin/autoprefixer"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      },
      "peerDependencies": {
        "postcss": "^8.1.0"
      }
    },
    "node_modules/available-typed-arrays": {
      "version": "1.0.7",
      "resolved": "https://registry.npmjs.org/available-typed-arrays/-/available-typed-arrays-1.0.7.tgz",
      "integrity": "sha512-wvUjBtSGN7+7SjNpq/9M2Tg350UZD3q62IFZLbRAR1bSMlCo1ZaeW+BJ+D090e4hIIZLBcTDWe4Mh4jvUDajzQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "possible-typed-array-names": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/axe-core": {
      "version": "4.12.1",
      "resolved": "https://registry.npmjs.org/axe-core/-/axe-core-4.12.1.tgz",
      "integrity": "sha512-s7iGf5GaVMxEG0ENN9x+xTr7GFZCb1ZP/1uATUpCEK2X78nDB3RwbtFCo9pGAf9ru+VwoQ464DkaLEeRM08wJA==",
      "dev": true,
      "license": "MPL-2.0",
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/axobject-query": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/axobject-query/-/axobject-query-4.1.0.tgz",
      "integrity": "sha512-qIj0G9wZbMGNLjLmg1PT6v2mE9AH2zlnADJD/2tC6E00hgmhUOfEB6greHPAfLRSufHqROIUTkw6E+M3lH0PTQ==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/balanced-match": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/balanced-match/-/balanced-match-1.0.2.tgz",
      "integrity": "sha512-3oSeUO0TMV67hN1AmbXsK4yaqU7tjiHlbxRDZOpH0KW9+CeX4bRAaX0Anxt0tx2MrpRpWwQaPwIlISEJhYU5Pw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/baseline-browser-mapping": {
      "version": "2.10.36",
      "resolved": "https://registry.npmjs.org/baseline-browser-mapping/-/baseline-browser-mapping-2.10.36.tgz",
      "integrity": "sha512-lVq/Df7LXlO79MVaaUHztSwWiG9oXoWHlgvNS51v8Dpd4+G4/VIy6qYePTw31nAVls33nUtnfezYeLkYAak9dg==",
      "license": "Apache-2.0",
      "bin": {
        "baseline-browser-mapping": "dist/cli.cjs"
      },
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/binary-extensions": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/binary-extensions/-/binary-extensions-2.3.0.tgz",
      "integrity": "sha512-Ceh+7ox5qe7LJuLHoY0feh3pHuUDHAcRUeyL2VYghZwfpkNIy/+8Ocg0a3UuSoYzavmylwuLWQOf3hl0jjMMIw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/brace-expansion": {
      "version": "1.1.15",
      "resolved": "https://registry.npmjs.org/brace-expansion/-/brace-expansion-1.1.15.tgz",
      "integrity": "sha512-EwOCDEex4quD37XhqM3omwtMoJjr//isUZz1JopUNWms+4Z2ViyM/k1YIRePpoVNnQhENnxtFjLaxNHrT7xIUg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "balanced-match": "^1.0.0",
        "concat-map": "0.0.1"
      }
    },
    "node_modules/braces": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/braces/-/braces-3.0.3.tgz",
      "integrity": "sha512-yQbXgO/OSZVD2IsiLlro+7Hf6Q18EJrKSEsdoMzKePKXct3gvD8oLcOQdIzGupr5Fj+EDe8gO/lxc1BzfMpxvA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fill-range": "^7.1.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/browserslist": {
      "version": "4.28.2",
      "resolved": "https://registry.npmjs.org/browserslist/-/browserslist-4.28.2.tgz",
      "integrity": "sha512-48xSriZYYg+8qXna9kwqjIVzuQxi+KYWp2+5nCYnYKPTr0LvD89Jqk2Or5ogxz0NUMfIjhh2lIUX/LyX9B4oIg==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/browserslist"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "baseline-browser-mapping": "^2.10.12",
        "caniuse-lite": "^1.0.30001782",
        "electron-to-chromium": "^1.5.328",
        "node-releases": "^2.0.36",
        "update-browserslist-db": "^1.2.3"
      },
      "bin": {
        "browserslist": "cli.js"
      },
      "engines": {
        "node": "^6 || ^7 || ^8 || ^9 || ^10 || ^11 || ^12 || >=13.7"
      }
    },
    "node_modules/call-bind": {
      "version": "1.0.9",
      "resolved": "https://registry.npmjs.org/call-bind/-/call-bind-1.0.9.tgz",
      "integrity": "sha512-a/hy+pNsFUTR+Iz8TCJvXudKVLAnz/DyeSUo10I5yvFDQJBFU2s9uqQpoSrJlroHUKoKqzg+epxyP9lqFdzfBQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.2",
        "es-define-property": "^1.0.1",
        "get-intrinsic": "^1.3.0",
        "set-function-length": "^1.2.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/call-bind-apply-helpers": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/call-bind-apply-helpers/-/call-bind-apply-helpers-1.0.2.tgz",
      "integrity": "sha512-Sp1ablJ0ivDkSzjcaJdxEunN5/XvksFJ2sMBFfq6x0ryhQV/2b/KwFe21cMpmHtPOSij8K99/wSfoEuTObmuMQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/call-bound": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/call-bound/-/call-bound-1.0.4.tgz",
      "integrity": "sha512-+ys997U96po4Kx/ABpBCqhA9EuxJaQWDQg7295H4hBphv3IZg0boBKuwYpt4YXp6MZ5AmZQnU/tyMTlRpaSejg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.2",
        "get-intrinsic": "^1.3.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/callsites": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/callsites/-/callsites-3.1.0.tgz",
      "integrity": "sha512-P8BjAsXvZS+VIDUI11hHCQEv74YT67YUi5JJFNWIqL235sBmjX4+qx9Muvls5ivyNENctx46xQLQ3aTuE7ssaQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/camelcase-css": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/camelcase-css/-/camelcase-css-2.0.1.tgz",
      "integrity": "sha512-QOSvevhslijgYwRx6Rv7zKdMF8lbRmx+uQGx2+vDc+KI/eBnsy9kit5aj23AgGu3pa4t9AgwbnXWqS+iOY+2aA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/caniuse-lite": {
      "version": "1.0.30001799",
      "resolved": "https://registry.npmjs.org/caniuse-lite/-/caniuse-lite-1.0.30001799.tgz",
      "integrity": "sha512-hG1bReV+OUU+MOqK4t/ZWI0tZOyz3rqS9XuhOUz1cIcbwBKjOyJEJuw9ER5JuNyqxNk8u/JUVbGibBOL1yrjFw==",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/caniuse-lite"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "CC-BY-4.0"
    },
    "node_modules/chalk": {
      "version": "4.1.2",
      "resolved": "https://registry.npmjs.org/chalk/-/chalk-4.1.2.tgz",
      "integrity": "sha512-oKnbhFyRIXpUuez8iBMmyEa4nbj4IOQyuhc/wy9kY7/WVPcwIO9VA668Pu8RkO7+0G76SLROeyw9CpQ061i4mA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-styles": "^4.1.0",
        "supports-color": "^7.1.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/chalk/chalk?sponsor=1"
      }
    },
    "node_modules/chokidar": {
      "version": "3.6.0",
      "resolved": "https://registry.npmjs.org/chokidar/-/chokidar-3.6.0.tgz",
      "integrity": "sha512-7VT13fmjotKpGipCW9JEQAusEPE+Ei8nl6/g4FBAmIm0GOOLMua9NDDo/DWp0ZAxCr3cPq5ZpBqmPAQgDda2Pw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "anymatch": "~3.1.2",
        "braces": "~3.0.2",
        "glob-parent": "~5.1.2",
        "is-binary-path": "~2.1.0",
        "is-glob": "~4.0.1",
        "normalize-path": "~3.0.0",
        "readdirp": "~3.6.0"
      },
      "engines": {
        "node": ">= 8.10.0"
      },
      "funding": {
        "url": "https://paulmillr.com/funding/"
      },
      "optionalDependencies": {
        "fsevents": "~2.3.2"
      }
    },
    "node_modules/chokidar/node_modules/glob-parent": {
      "version": "5.1.2",
      "resolved": "https://registry.npmjs.org/glob-parent/-/glob-parent-5.1.2.tgz",
      "integrity": "sha512-AOIgSQCepiJYwP3ARnGx+5VnTu2HBYdzbGP45eLw1vr3zB3vZLeyed1sC9hnbcOc9/SrMyM5RPQrkGz4aS9Zow==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "is-glob": "^4.0.1"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/client-only": {
      "version": "0.0.1",
      "resolved": "https://registry.npmjs.org/client-only/-/client-only-0.0.1.tgz",
      "integrity": "sha512-IV3Ou0jSMzZrd3pZ48nLkT9DA7Ag1pnPzaiQhpW7c3RbcqqzvzzVu+L8gfqMp/8IM2MQtSiqaCxrrcfu8I8rMA==",
      "license": "MIT"
    },
    "node_modules/clsx": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/clsx/-/clsx-2.1.1.tgz",
      "integrity": "sha512-eYm0QWBtUrBWZWG0d386OGAw16Z995PiOVo2B7bjWSbHedGl5e0ZWaq65kOGgUSNesEIDkB9ISbTg/JK9dhCZA==",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/color-convert": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/color-convert/-/color-convert-2.0.1.tgz",
      "integrity": "sha512-RRECPsj7iu/xb5oKYcsFHSppFNnsj/52OVTRKb4zP5onXwVF3zVmmToNcOfGC+CRDpfK/U584fMg38ZHCaElKQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "color-name": "~1.1.4"
      },
      "engines": {
        "node": ">=7.0.0"
      }
    },
    "node_modules/color-name": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/color-name/-/color-name-1.1.4.tgz",
      "integrity": "sha512-dOy+3AuW3a2wNbZHIuMZpTcgjGuLU/uBL/ubcZF9OXbDo8ff4O8yVp5Bf0efS8uEoYo5q4Fx7dY9OgQGXgAsQA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/commander": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/commander/-/commander-4.1.1.tgz",
      "integrity": "sha512-NOKm8xhkzAjzFx8B2v5OAHT+u5pRQc2UCa2Vq9jYL/31o2wi9mxBA7LIFs3sV5VSC49z6pEhfbMULvShKj26WA==",
      "dev": true,
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/concat-map": {
      "version": "0.0.1",
      "resolved": "https://registry.npmjs.org/concat-map/-/concat-map-0.0.1.tgz",
      "integrity": "sha512-/Srv4dswyQNBfohGpz9o6Yb3Gz3SrUDqBH5rTuhGR7ahtlbYKnVxw2bCFMRljaA7EXHaXZ8wsHdodFvbkhKmqg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/convert-source-map": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/convert-source-map/-/convert-source-map-2.0.0.tgz",
      "integrity": "sha512-Kvp459HrV2FEJ1CAsi1Ku+MY3kasH19TFykTz2xWmMeq6bk2NU3XXvfJ+Q61m0xktWwt+1HSYf3JZsTms3aRJg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/cookie": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/cookie/-/cookie-1.1.1.tgz",
      "integrity": "sha512-ei8Aos7ja0weRpFzJnEA9UHJ/7XQmqglbRwnf2ATjcB9Wq874VKH9kfjjirM6UhU2/E5fFYadylyhFldcqSidQ==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/cross-spawn": {
      "version": "7.0.6",
      "resolved": "https://registry.npmjs.org/cross-spawn/-/cross-spawn-7.0.6.tgz",
      "integrity": "sha512-uV2QOWP2nWzsy2aMp8aRibhi9dlzF5Hgh5SHaB9OiTGEyDTiJJyx0uy51QXdyWbtAHNua4XJzUKca3OzKUd3vA==",
      "dev": true,
      "dependencies": {
        "path-key": "^3.1.0",
        "shebang-command": "^2.0.0",
        "which": "^2.0.1"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/cssesc": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/cssesc/-/cssesc-3.0.0.tgz",
      "integrity": "sha512-/Tb/JcjK111nNScGob5MNtsntNM1aCNUDipB/TkwZFhyDrrE47SOx/18wF2bbjgc3ZzCSKW1T5nt5EbFoAz/Vg==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "cssesc": "bin/cssesc"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/csstype": {
      "version": "3.2.3",
      "resolved": "https://registry.npmjs.org/csstype/-/csstype-3.2.3.tgz",
      "integrity": "sha512-z1HGKcYy2xA8AGQfwrn0PAy+PB7X/GSj3UVJW9qKyn43xWa+gl5nXmU4qqLMRzWVLFC8KusUX8T/0kCiOYpAIQ==",
      "devOptional": true,
      "license": "MIT"
    },
    "node_modules/d3-array": {
      "version": "3.2.4",
      "resolved": "https://registry.npmjs.org/d3-array/-/d3-array-3.2.4.tgz",
      "integrity": "sha512-tdQAmyA18i4J7wprpYq8ClcxZy3SC31QMeByyCFyRt7BVHdREQZ5lpzoe5mFEYZUWe+oq8HBvk9JjpibyEV4Jg==",
      "license": "ISC",
      "dependencies": {
        "internmap": "1 - 2"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-color": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/d3-color/-/d3-color-3.1.0.tgz",
      "integrity": "sha512-zg/chbXyeBtMQ1LbD/WSoW2DpC3I0mpmPdW+ynRTj/x2DAWYrIY7qeZIHidozwV24m4iavr15lNwIwLxRmOxhA==",
      "license": "ISC",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-ease": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/d3-ease/-/d3-ease-3.0.1.tgz",
      "integrity": "sha512-wR/XK3D3XcLIZwpbvQwQ5fK+8Ykds1ip7A2Txe0yxncXSdq1L9skcG7blcedkOX+ZcgxGAmLX1FrRGbADwzi0w==",
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-format": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/d3-format/-/d3-format-3.1.2.tgz",
      "integrity": "sha512-AJDdYOdnyRDV5b6ArilzCPPwc1ejkHcoyFarqlPqT7zRYjhavcT3uSrqcMvsgh2CgoPbK3RCwyHaVyxYcP2Arg==",
      "license": "ISC",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-interpolate": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/d3-interpolate/-/d3-interpolate-3.0.1.tgz",
      "integrity": "sha512-3bYs1rOD33uo8aqJfKP3JWPAibgw8Zm2+L9vBKEHJ2Rg+viTR7o5Mmv5mZcieN+FRYaAOWX5SJATX6k1PWz72g==",
      "license": "ISC",
      "dependencies": {
        "d3-color": "1 - 3"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-path": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/d3-path/-/d3-path-3.1.0.tgz",
      "integrity": "sha512-p3KP5HCf/bvjBSSKuXid6Zqijx7wIfNW+J/maPs+iwR35at5JCbLUT0LzF1cnjbCHWhqzQTIN2Jpe8pRebIEFQ==",
      "license": "ISC",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-scale": {
      "version": "4.0.2",
      "resolved": "https://registry.npmjs.org/d3-scale/-/d3-scale-4.0.2.tgz",
      "integrity": "sha512-GZW464g1SH7ag3Y7hXjf8RoUuAFIqklOAq3MRl4OaWabTFJY9PN/E1YklhXLh+OQ3fM9yS2nOkCoS+WLZ6kvxQ==",
      "license": "ISC",
      "dependencies": {
        "d3-array": "2.10.0 - 3",
        "d3-format": "1 - 3",
        "d3-interpolate": "1.2.0 - 3",
        "d3-time": "2.1.1 - 3",
        "d3-time-format": "2 - 4"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-shape": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/d3-shape/-/d3-shape-3.2.0.tgz",
      "integrity": "sha512-SaLBuwGm3MOViRq2ABk3eLoxwZELpH6zhl3FbAoJ7Vm1gofKx6El1Ib5z23NUEhF9AsGl7y+dzLe5Cw2AArGTA==",
      "dependencies": {
        "d3-path": "^3.1.0"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-time": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/d3-time/-/d3-time-3.1.0.tgz",
      "integrity": "sha512-VqKjzBLejbSMT4IgbmVgDjpkYrNWUYJnbCGo874u7MMKIWsILRX+OpX/gTk8MqjpT1A/c6HY2dCA77ZN0lkQ2Q==",
      "license": "ISC",
      "dependencies": {
        "d3-array": "2 - 3"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-time-format": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/d3-time-format/-/d3-time-format-4.1.0.tgz",
      "integrity": "sha512-dJxPBlzC7NugB2PDLwo9Q8JiTR3M3e4/XANkreKSUxF8vvXKqm1Yfq4Q5dl8budlunRVlUUaDUgFt7eA8D6NLg==",
      "license": "ISC",
      "dependencies": {
        "d3-time": "1 - 3"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-timer": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/d3-timer/-/d3-timer-3.0.1.tgz",
      "integrity": "sha512-ndfJ/JxxMd3nw31uyKoY2naivF+r29V+Lc0svZxe1JvvIRmi8hUsrMvdOwgS1o6uBHmiz91geQ0ylPP0aj1VUA==",
      "license": "ISC",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/damerau-levenshtein": {
      "version": "1.0.8",
      "resolved": "https://registry.npmjs.org/damerau-levenshtein/-/damerau-levenshtein-1.0.8.tgz",
      "integrity": "sha512-sdQSFB7+llfUcQHUQO3+B8ERRj0Oa4w9POWMI/puGtuf7gFywGmkaLCElnudfTiKZV+NvHqL0ifzdrI8Ro7ESA==",
      "dev": true,
      "license": "BSD-2-Clause"
    },
    "node_modules/data-view-buffer": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/data-view-buffer/-/data-view-buffer-1.0.2.tgz",
      "integrity": "sha512-EmKO5V3OLXh1rtK2wgXRansaK1/mtVdTUEiEI0W8RkvgT05kfxaH29PliLnpLP73yYO6142Q72QNa8Wx/A5CqQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "es-errors": "^1.3.0",
        "is-data-view": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/data-view-byte-length": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/data-view-byte-length/-/data-view-byte-length-1.0.2.tgz",
      "integrity": "sha512-tuhGbE6CfTM9+5ANGf+oQb72Ky/0+s3xKUpHvShfiz2RxMFgFPjsXuRLBVMtvMs15awe45SRb83D6wH4ew6wlQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "es-errors": "^1.3.0",
        "is-data-view": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/inspect-js"
      }
    },
    "node_modules/data-view-byte-offset": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/data-view-byte-offset/-/data-view-byte-offset-1.0.1.tgz",
      "integrity": "sha512-BS8PfmtDGnrgYdOonGZQdLZslWIeCGFP9tpan0hi1Co2Zr2NKADsvGYA8XxuG/4UWgJ6Cjtv+YJnB6MM69QGlQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "is-data-view": "^1.0.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/debug": {
      "version": "4.4.3",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.3.tgz",
      "integrity": "sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/decimal.js-light": {
      "version": "2.5.1",
      "resolved": "https://registry.npmjs.org/decimal.js-light/-/decimal.js-light-2.5.1.tgz",
      "integrity": "sha512-qIMFpTMZmny+MMIitAB6D7iVPEorVw6YQRWkvarTkT4tBeSLLiHzcwj6q0MmYSFCiVpiqPJTJEYIrpcPzVEIvg==",
      "license": "MIT"
    },
    "node_modules/deep-is": {
      "version": "0.1.4",
      "resolved": "https://registry.npmjs.org/deep-is/-/deep-is-0.1.4.tgz",
      "integrity": "sha512-oIPzksmTg4/MriiaYGO+okXDT7ztn/w3Eptv/+gSIdMdKsJo0u4CfYNFJPy+4SKMuCqGw2wxnA+URMg3t8a/bQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/define-data-property": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/define-data-property/-/define-data-property-1.1.4.tgz",
      "integrity": "sha512-rBMvIzlpA8v6E+SJZoo++HAYqsLrkg7MSfIinMPFhmkorw7X+dOXVJQs+QT69zGkzMyfDnIMN2Wid1+NbL3T+A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-define-property": "^1.0.0",
        "es-errors": "^1.3.0",
        "gopd": "^1.0.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/define-properties": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/define-properties/-/define-properties-1.2.1.tgz",
      "integrity": "sha512-8QmQKqEASLd5nx0U1B1okLElbUuuttJ/AnYmRXbbbGDWh6uS208EjD4Xqq/I9wK7u0v6O08XhTWnt5XtEbR6Dg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "define-data-property": "^1.0.1",
        "has-property-descriptors": "^1.0.0",
        "object-keys": "^1.1.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/detect-libc": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/detect-libc/-/detect-libc-2.1.2.tgz",
      "integrity": "sha512-Btj2BOOO83o3WyH59e8MgXsxEQVcarkUOpEYrubB0urwnN10yQ364rsiByU11nZlqWYZm05i/of7io4mzihBtQ==",
      "license": "Apache-2.0",
      "optional": true,
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/didyoumean": {
      "version": "1.2.2",
      "resolved": "https://registry.npmjs.org/didyoumean/-/didyoumean-1.2.2.tgz",
      "integrity": "sha512-gxtyfqMg7GKyhQmb056K7M3xszy/myH8w+B4RT+QXBQsvAOdc3XymqDDPHx1BgPgsdAA5SIifona89YtRATDzw==",
      "dev": true
    },
    "node_modules/dlv": {
      "version": "1.1.3",
      "resolved": "https://registry.npmjs.org/dlv/-/dlv-1.1.3.tgz",
      "integrity": "sha512-+HlytyjlPKnIG8XuRG8WvmBP8xs8P71y+SKKS6ZXWoEgLuePxtDoUEiH7WkdePWrQ5JBpE6aoVqfZfJUQkjXwA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/doctrine": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/doctrine/-/doctrine-2.1.0.tgz",
      "integrity": "sha512-35mSku4ZXK0vfCuHEDAwt55dg2jNajHZ1odvF+8SSr82EsZY4QmXfuWso8oEd8zRhVObSN18aM0CjSdoBX7zIw==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "esutils": "^2.0.2"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/dunder-proto": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/dunder-proto/-/dunder-proto-1.0.1.tgz",
      "integrity": "sha512-KIN/nDJBQRcXw0MLVhZE9iQHmG68qAVIBg9CqmUYjmQIhgij9U5MFvrqkUL5FbtyyzZuOeOt0zdeRe4UY7ct+A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.1",
        "es-errors": "^1.3.0",
        "gopd": "^1.2.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/electron-to-chromium": {
      "version": "1.5.372",
      "resolved": "https://registry.npmjs.org/electron-to-chromium/-/electron-to-chromium-1.5.372.tgz",
      "integrity": "sha512-M3yhbAlilnwqC8D21t28UCDGHyitShTmmLRU/H+b74P6Ski16Nb9HONYEaVpMj/pwC7BEo5B95FpjODLCWbtfA==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/emoji-regex": {
      "version": "9.2.2",
      "resolved": "https://registry.npmjs.org/emoji-regex/-/emoji-regex-9.2.2.tgz",
      "integrity": "sha512-L18DaJsXSUk2+42pv8mLs5jJT2hqFkFE4j21wOmgbUqsZ2hL72NsUU785g9RXgo3s0ZNgVl42TiHp3ZtOv/Vyg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/es-abstract": {
      "version": "1.24.2",
      "resolved": "https://registry.npmjs.org/es-abstract/-/es-abstract-1.24.2.tgz",
      "integrity": "sha512-2FpH9Q5i2RRwyEP1AylXe6nYLR5OhaJTZwmlcP0dL/+JCbgg7yyEo/sEK6HeGZRf3dFpWwThaRHVApXSkW3xeg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "array-buffer-byte-length": "^1.0.2",
        "arraybuffer.prototype.slice": "^1.0.4",
        "available-typed-arrays": "^1.0.7",
        "call-bind": "^1.0.8",
        "call-bound": "^1.0.4",
        "data-view-buffer": "^1.0.2",
        "data-view-byte-length": "^1.0.2",
        "data-view-byte-offset": "^1.0.1",
        "es-define-property": "^1.0.1",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.1.1",
        "es-set-tostringtag": "^2.1.0",
        "es-to-primitive": "^1.3.0",
        "function.prototype.name": "^1.1.8",
        "get-intrinsic": "^1.3.0",
        "get-proto": "^1.0.1",
        "get-symbol-description": "^1.1.0",
        "globalthis": "^1.0.4",
        "gopd": "^1.2.0",
        "has-property-descriptors": "^1.0.2",
        "has-proto": "^1.2.0",
        "has-symbols": "^1.1.0",
        "hasown": "^2.0.2",
        "internal-slot": "^1.1.0",
        "is-array-buffer": "^3.0.5",
        "is-callable": "^1.2.7",
        "is-data-view": "^1.0.2",
        "is-negative-zero": "^2.0.3",
        "is-regex": "^1.2.1",
        "is-set": "^2.0.3",
        "is-shared-array-buffer": "^1.0.4",
        "is-string": "^1.1.1",
        "is-typed-array": "^1.1.15",
        "is-weakref": "^1.1.1",
        "math-intrinsics": "^1.1.0",
        "object-inspect": "^1.13.4",
        "object-keys": "^1.1.1",
        "object.assign": "^4.1.7",
        "own-keys": "^1.0.1",
        "regexp.prototype.flags": "^1.5.4",
        "safe-array-concat": "^1.1.3",
        "safe-push-apply": "^1.0.0",
        "safe-regex-test": "^1.1.0",
        "set-proto": "^1.0.0",
        "stop-iteration-iterator": "^1.1.0",
        "string.prototype.trim": "^1.2.10",
        "string.prototype.trimend": "^1.0.9",
        "string.prototype.trimstart": "^1.0.8",
        "typed-array-buffer": "^1.0.3",
        "typed-array-byte-length": "^1.0.3",
        "typed-array-byte-offset": "^1.0.4",
        "typed-array-length": "^1.0.7",
        "unbox-primitive": "^1.1.0",
        "which-typed-array": "^1.1.19"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/es-define-property": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/es-define-property/-/es-define-property-1.0.1.tgz",
      "integrity": "sha512-e3nRfgfUZ4rNGL232gUgX06QNyyez04KdjFrF+LTRoOXmrOgFKDg4BCdsjW8EnT69eqdYGmRpJwiPVYNrCaW3g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-errors": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/es-errors/-/es-errors-1.3.0.tgz",
      "integrity": "sha512-Zf5H2Kxt2xjTvbJvP2ZWLEICxA6j+hAmMzIlypy4xcBg1vKVnx89Wy0GbS+kf5cwCVFFzdCFh2XSCFNULS6csw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-iterator-helpers": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/es-iterator-helpers/-/es-iterator-helpers-1.3.3.tgz",
      "integrity": "sha512-0PuBxFi+4uPanB97iDxCLWuHeYud2FALrw5HFZGtAF38UpJDbDC8frwp2cnDyae692CQ0dou60UwWfhgsa4U/g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.9",
        "call-bound": "^1.0.4",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.24.2",
        "es-errors": "^1.3.0",
        "es-set-tostringtag": "^2.1.0",
        "function-bind": "^1.1.2",
        "get-intrinsic": "^1.3.0",
        "globalthis": "^1.0.4",
        "gopd": "^1.2.0",
        "has-property-descriptors": "^1.0.2",
        "has-proto": "^1.2.0",
        "has-symbols": "^1.1.0",
        "internal-slot": "^1.1.0",
        "iterator.prototype": "^1.1.5",
        "math-intrinsics": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-object-atoms": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/es-object-atoms/-/es-object-atoms-1.1.2.tgz",
      "integrity": "sha512-HWcBoN6NileqtSydK2FqHbS/LoDd2pqrnQHLyJzBj4kOp/ky2MWMN694xOfkK8/SnUsW2DH7EfyVlydKCsm1Zw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-set-tostringtag": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/es-set-tostringtag/-/es-set-tostringtag-2.1.0.tgz",
      "integrity": "sha512-j6vWzfrGVfyXxge+O0x5sh6cvxAog0a/4Rdd2K36zCMV5eJ+/+tOAngRO8cODMNWbVRdVlmGZQL2YS3yR8bIUA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.6",
        "has-tostringtag": "^1.0.2",
        "hasown": "^2.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-shim-unscopables": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/es-shim-unscopables/-/es-shim-unscopables-1.1.0.tgz",
      "integrity": "sha512-d9T8ucsEhh8Bi1woXCf+TIKDIROLG5WCkxg8geBCbvk22kzwC5G2OnXVMO6FUsvQlgUUXQ2itephWDLqDzbeCw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "hasown": "^2.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-to-primitive": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/es-to-primitive/-/es-to-primitive-1.3.0.tgz",
      "integrity": "sha512-w+5mJ3GuFL+NjVtJlvydShqE1eN3h3PbI7/5LAsYJP/2qtuMXjfL2LpHSRqo4b4eSF5K/DH1JXKUAHSB2UW50g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-callable": "^1.2.7",
        "is-date-object": "^1.0.5",
        "is-symbol": "^1.0.4"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/es-toolkit": {
      "version": "1.47.1",
      "resolved": "https://registry.npmjs.org/es-toolkit/-/es-toolkit-1.47.1.tgz",
      "integrity": "sha512-5RAqEwf4P4E17p+W75KLOWw/nOvKZzSQpxM32IpI2KZLaVonjTrZ0Ai5ghMaVI9eKC2p8eoQgcBdkEDgzFk6+Q==",
      "license": "MIT",
      "workspaces": [
        "docs",
        "benchmarks"
      ]
    },
    "node_modules/escalade": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/escalade/-/escalade-3.2.0.tgz",
      "integrity": "sha512-WUj2qlxaQtO4g6Pq5c29GTcWGDyd8itL8zTlipgECz3JesAiiOKotd8JU6otB3PACgG6xkJUyVhboMS+bje/jA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/escape-string-regexp": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/escape-string-regexp/-/escape-string-regexp-4.0.0.tgz",
      "integrity": "sha512-TtpcNJ3XAzx3Gq8sWRzJaVajRs0uVxA2YAkdb1jm2YkPz4G6egUFAyA3n5vtEIZefPk5Wa4UXbKuS5fKkJWdgA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/eslint": {
      "version": "9.39.4",
      "resolved": "https://registry.npmjs.org/eslint/-/eslint-9.39.4.tgz",
      "integrity": "sha512-XoMjdBOwe/esVgEvLmNsD3IRHkm7fbKIUGvrleloJXUZgDHig2IPWNniv+GwjyJXzuNqVjlr5+4yVUZjycJwfQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@eslint-community/eslint-utils": "^4.8.0",
        "@eslint-community/regexpp": "^4.12.1",
        "@eslint/config-array": "^0.21.2",
        "@eslint/config-helpers": "^0.4.2",
        "@eslint/core": "^0.17.0",
        "@eslint/eslintrc": "^3.3.5",
        "@eslint/js": "9.39.4",
        "@eslint/plugin-kit": "^0.4.1",
        "@humanfs/node": "^0.16.6",
        "@humanwhocodes/module-importer": "^1.0.1",
        "@humanwhocodes/retry": "^0.4.2",
        "@types/estree": "^1.0.6",
        "ajv": "^6.14.0",
        "chalk": "^4.0.0",
        "cross-spawn": "^7.0.6",
        "debug": "^4.3.2",
        "escape-string-regexp": "^4.0.0",
        "eslint-scope": "^8.4.0",
        "eslint-visitor-keys": "^4.2.1",
        "espree": "^10.4.0",
        "esquery": "^1.5.0",
        "esutils": "^2.0.2",
        "fast-deep-equal": "^3.1.3",
        "file-entry-cache": "^8.0.0",
        "find-up": "^5.0.0",
        "glob-parent": "^6.0.2",
        "ignore": "^5.2.0",
        "imurmurhash": "^0.1.4",
        "is-glob": "^4.0.0",
        "json-stable-stringify-without-jsonify": "^1.0.1",
        "lodash.merge": "^4.6.2",
        "minimatch": "^3.1.5",
        "natural-compare": "^1.4.0",
        "optionator": "^0.9.3"
      },
      "bin": {
        "eslint": "bin/eslint.js"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://eslint.org/donate"
      },
      "peerDependencies": {
        "jiti": "*"
      },
      "peerDependenciesMeta": {
        "jiti": {
          "optional": true
        }
      }
    },
    "node_modules/eslint-config-next": {
      "version": "16.2.9",
      "resolved": "https://registry.npmjs.org/eslint-config-next/-/eslint-config-next-16.2.9.tgz",
      "integrity": "sha512-olGtBrs07bQchpaJWeqbk9GaMoU0oGmN/pYNEBXSbfgKngb5uHnPe37X6tVeh6DJfaWFQildvinGEOrolo5fmw==",
      "dev": true,
      "dependencies": {
        "@next/eslint-plugin-next": "16.2.9",
        "eslint-import-resolver-node": "^0.3.6",
        "eslint-import-resolver-typescript": "^3.5.2",
        "eslint-plugin-import": "^2.32.0",
        "eslint-plugin-jsx-a11y": "^6.10.0",
        "eslint-plugin-react": "^7.37.0",
        "eslint-plugin-react-hooks": "^7.0.0",
        "globals": "16.4.0",
        "typescript-eslint": "^8.46.0"
      },
      "peerDependencies": {
        "eslint": ">=9.0.0",
        "typescript": ">=3.3.1"
      },
      "peerDependenciesMeta": {
        "typescript": {
          "optional": true
        }
      }
    },
    "node_modules/eslint-config-next/node_modules/globals": {
      "version": "16.4.0",
      "resolved": "https://registry.npmjs.org/globals/-/globals-16.4.0.tgz",
      "integrity": "sha512-ob/2LcVVaVGCYN+r14cnwnoDPUufjiYgSqRhiFD0Q1iI4Odora5RE8Iv1D24hAz5oMophRGkGz+yuvQmmUMnMw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/eslint-import-resolver-node": {
      "version": "0.3.10",
      "resolved": "https://registry.npmjs.org/eslint-import-resolver-node/-/eslint-import-resolver-node-0.3.10.tgz",
      "integrity": "sha512-tRrKqFyCaKict5hOd244sL6EQFNycnMQnBe+j8uqGNXYzsImGbGUU4ibtoaBmv5FLwJwcFJNeg1GeVjQfbMrDQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "debug": "^3.2.7",
        "is-core-module": "^2.16.1",
        "resolve": "^2.0.0-next.6"
      }
    },
    "node_modules/eslint-import-resolver-node/node_modules/debug": {
      "version": "3.2.7",
      "resolved": "https://registry.npmjs.org/debug/-/debug-3.2.7.tgz",
      "integrity": "sha512-CFjzYYAi4ThfiQvizrFQevTTXHtnCqWfe7x1AhgEscTz6ZbLbfoLRLPugTQyBth6f8ZERVUSyWHFD/7Wu4t1XQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.1"
      }
    },
    "node_modules/eslint-import-resolver-typescript": {
      "version": "3.10.1",
      "resolved": "https://registry.npmjs.org/eslint-import-resolver-typescript/-/eslint-import-resolver-typescript-3.10.1.tgz",
      "integrity": "sha512-A1rHYb06zjMGAxdLSkN2fXPBwuSaQ0iO5M/hdyS0Ajj1VBaRp0sPD3dn1FhME3c/JluGFbwSxyCfqdSbtQLAHQ==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "@nolyfill/is-core-module": "1.0.39",
        "debug": "^4.4.0",
        "get-tsconfig": "^4.10.0",
        "is-bun-module": "^2.0.0",
        "stable-hash": "^0.0.5",
        "tinyglobby": "^0.2.13",
        "unrs-resolver": "^1.6.2"
      },
      "engines": {
        "node": "^14.18.0 || >=16.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint-import-resolver-typescript"
      },
      "peerDependencies": {
        "eslint": "*",
        "eslint-plugin-import": "*",
        "eslint-plugin-import-x": "*"
      },
      "peerDependenciesMeta": {
        "eslint-plugin-import": {
          "optional": true
        },
        "eslint-plugin-import-x": {
          "optional": true
        }
      }
    },
    "node_modules/eslint-module-utils": {
      "version": "2.13.0",
      "resolved": "https://registry.npmjs.org/eslint-module-utils/-/eslint-module-utils-2.13.0.tgz",
      "integrity": "sha512-bLohSkT6469rRs8czj0tLTD8vaeIS/whvPRJVjDr7IuoTT1k5DYDERlNycjDj/HkOlvQdYurmfZ/g3fG5bgeLQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "debug": "^3.2.7"
      },
      "engines": {
        "node": ">=4"
      },
      "peerDependenciesMeta": {
        "eslint": {
          "optional": true
        }
      }
    },
    "node_modules/eslint-module-utils/node_modules/debug": {
      "version": "3.2.7",
      "resolved": "https://registry.npmjs.org/debug/-/debug-3.2.7.tgz",
      "integrity": "sha512-CFjzYYAi4ThfiQvizrFQevTTXHtnCqWfe7x1AhgEscTz6ZbLbfoLRLPugTQyBth6f8ZERVUSyWHFD/7Wu4t1XQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.1"
      }
    },
    "node_modules/eslint-plugin-import": {
      "version": "2.32.0",
      "resolved": "https://registry.npmjs.org/eslint-plugin-import/-/eslint-plugin-import-2.32.0.tgz",
      "integrity": "sha512-whOE1HFo/qJDyX4SnXzP4N6zOWn79WhnCUY/iDR0mPfQZO8wcYE4JClzI2oZrhBnnMUCBCHZhO6VQyoBU95mZA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@rtsao/scc": "^1.1.0",
        "array-includes": "^3.1.9",
        "array.prototype.findlastindex": "^1.2.6",
        "array.prototype.flat": "^1.3.3",
        "array.prototype.flatmap": "^1.3.3",
        "debug": "^3.2.7",
        "doctrine": "^2.1.0",
        "eslint-import-resolver-node": "^0.3.9",
        "eslint-module-utils": "^2.12.1",
        "hasown": "^2.0.2",
        "is-core-module": "^2.16.1",
        "is-glob": "^4.0.3",
        "minimatch": "^3.1.2",
        "object.fromentries": "^2.0.8",
        "object.groupby": "^1.0.3",
        "object.values": "^1.2.1",
        "semver": "^6.3.1",
        "string.prototype.trimend": "^1.0.9",
        "tsconfig-paths": "^3.15.0"
      },
      "engines": {
        "node": ">=4"
      },
      "peerDependencies": {
        "eslint": "^2 || ^3 || ^4 || ^5 || ^6 || ^7.2.0 || ^8 || ^9"
      }
    },
    "node_modules/eslint-plugin-import/node_modules/debug": {
      "version": "3.2.7",
      "resolved": "https://registry.npmjs.org/debug/-/debug-3.2.7.tgz",
      "integrity": "sha512-CFjzYYAi4ThfiQvizrFQevTTXHtnCqWfe7x1AhgEscTz6ZbLbfoLRLPugTQyBth6f8ZERVUSyWHFD/7Wu4t1XQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.1"
      }
    },
    "node_modules/eslint-plugin-import/node_modules/semver": {
      "version": "6.3.1",
      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",
      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",
      "dev": true,
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      }
    },
    "node_modules/eslint-plugin-jsx-a11y": {
      "version": "6.10.2",
      "resolved": "https://registry.npmjs.org/eslint-plugin-jsx-a11y/-/eslint-plugin-jsx-a11y-6.10.2.tgz",
      "integrity": "sha512-scB3nz4WmG75pV8+3eRUQOHZlNSUhFNq37xnpgRkCCELU3XMvXAxLk1eqWWyE22Ki4Q01Fnsw9BA3cJHDPgn2Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "aria-query": "^5.3.2",
        "array-includes": "^3.1.8",
        "array.prototype.flatmap": "^1.3.2",
        "ast-types-flow": "^0.0.8",
        "axe-core": "^4.10.0",
        "axobject-query": "^4.1.0",
        "damerau-levenshtein": "^1.0.8",
        "emoji-regex": "^9.2.2",
        "hasown": "^2.0.2",
        "jsx-ast-utils": "^3.3.5",
        "language-tags": "^1.0.9",
        "minimatch": "^3.1.2",
        "object.fromentries": "^2.0.8",
        "safe-regex-test": "^1.0.3",
        "string.prototype.includes": "^2.0.1"
      },
      "engines": {
        "node": ">=4.0"
      },
      "peerDependencies": {
        "eslint": "^3 || ^4 || ^5 || ^6 || ^7 || ^8 || ^9"
      }
    },
    "node_modules/eslint-plugin-react": {
      "version": "7.37.5",
      "resolved": "https://registry.npmjs.org/eslint-plugin-react/-/eslint-plugin-react-7.37.5.tgz",
      "integrity": "sha512-Qteup0SqU15kdocexFNAJMvCJEfa2xUKNV4CC1xsVMrIIqEy3SQ/rqyxCWNzfrd3/ldy6HMlD2e0JDVpDg2qIA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "array-includes": "^3.1.8",
        "array.prototype.findlast": "^1.2.5",
        "array.prototype.flatmap": "^1.3.3",
        "array.prototype.tosorted": "^1.1.4",
        "doctrine": "^2.1.0",
        "es-iterator-helpers": "^1.2.1",
        "estraverse": "^5.3.0",
        "hasown": "^2.0.2",
        "jsx-ast-utils": "^2.4.1 || ^3.0.0",
        "minimatch": "^3.1.2",
        "object.entries": "^1.1.9",
        "object.fromentries": "^2.0.8",
        "object.values": "^1.2.1",
        "prop-types": "^15.8.1",
        "resolve": "^2.0.0-next.5",
        "semver": "^6.3.1",
        "string.prototype.matchall": "^4.0.12",
        "string.prototype.repeat": "^1.0.0"
      },
      "engines": {
        "node": ">=4"
      },
      "peerDependencies": {
        "eslint": "^3 || ^4 || ^5 || ^6 || ^7 || ^8 || ^9.7"
      }
    },
    "node_modules/eslint-plugin-react-hooks": {
      "version": "7.1.1",
      "resolved": "https://registry.npmjs.org/eslint-plugin-react-hooks/-/eslint-plugin-react-hooks-7.1.1.tgz",
      "integrity": "sha512-f2I7Gw6JbvCexzIInuSbZpfdQ44D7iqdWX01FKLvrPgqxoE7oMj8clOfto8U6vYiz4yd5oKu39rRSVOe1zRu0g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/core": "^7.24.4",
        "@babel/parser": "^7.24.4",
        "hermes-parser": "^0.25.1",
        "zod": "^3.25.0 || ^4.0.0",
        "zod-validation-error": "^3.5.0 || ^4.0.0"
      },
      "engines": {
        "node": ">=18"
      },
      "peerDependencies": {
        "eslint": "^3.0.0 || ^4.0.0 || ^5.0.0 || ^6.0.0 || ^7.0.0 || ^8.0.0-0 || ^9.0.0 || ^10.0.0"
      }
    },
    "node_modules/eslint-plugin-react/node_modules/semver": {
      "version": "6.3.1",
      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",
      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",
      "dev": true,
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      }
    },
    "node_modules/eslint-scope": {
      "version": "8.4.0",
      "resolved": "https://registry.npmjs.org/eslint-scope/-/eslint-scope-8.4.0.tgz",
      "integrity": "sha512-sNXOfKCn74rt8RICKMvJS7XKV/Xk9kA7DyJr8mJik3S7Cwgy3qlkkmyS2uQB3jiJg6VNdZd/pDBJu0nvG2NlTg==",
      "dev": true,
      "license": "BSD-2-Clause",
      "dependencies": {
        "esrecurse": "^4.3.0",
        "estraverse": "^5.2.0"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/eslint-visitor-keys": {
      "version": "4.2.1",
      "resolved": "https://registry.npmjs.org/eslint-visitor-keys/-/eslint-visitor-keys-4.2.1.tgz",
      "integrity": "sha512-Uhdk5sfqcee/9H/rCOJikYz67o0a2Tw2hGRPOG2Y1R2dg7brRe1uG0yaNQDHu+TO/uQPF/5eCapvYSmHUjt7JQ==",
      "dev": true,
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/espree": {
      "version": "10.4.0",
      "resolved": "https://registry.npmjs.org/espree/-/espree-10.4.0.tgz",
      "integrity": "sha512-j6PAQ2uUr79PZhBjP5C5fhl8e39FmRnOjsD5lGnWrFU8i2G776tBK7+nP8KuQUTTyAZUwfQqXAgrVH5MbH9CYQ==",
      "dev": true,
      "license": "BSD-2-Clause",
      "dependencies": {
        "acorn": "^8.15.0",
        "acorn-jsx": "^5.3.2",
        "eslint-visitor-keys": "^4.2.1"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/esquery": {
      "version": "1.7.0",
      "resolved": "https://registry.npmjs.org/esquery/-/esquery-1.7.0.tgz",
      "integrity": "sha512-Ap6G0WQwcU/LHsvLwON1fAQX9Zp0A2Y6Y/cJBl9r/JbW90Zyg4/zbG6zzKa2OTALELarYHmKu0GhpM5EO+7T0g==",
      "dev": true,
      "dependencies": {
        "estraverse": "^5.1.0"
      },
      "engines": {
        "node": ">=0.10"
      }
    },
    "node_modules/esrecurse": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/esrecurse/-/esrecurse-4.3.0.tgz",
      "integrity": "sha512-KmfKL3b6G+RXvP8N1vr3Tq1kL/oCFgn2NYXEtqP8/L3pKapUA4G8cFVaoF3SU323CD4XypR/ffioHmkti6/Tag==",
      "dev": true,
      "license": "BSD-2-Clause",
      "dependencies": {
        "estraverse": "^5.2.0"
      },
      "engines": {
        "node": ">=4.0"
      }
    },
    "node_modules/estraverse": {
      "version": "5.3.0",
      "resolved": "https://registry.npmjs.org/estraverse/-/estraverse-5.3.0.tgz",
      "integrity": "sha512-MMdARuVEQziNTeJD8DgMqmhwR11BRQ/cBP+pLtYdSTnf3MIO8fFeiINEbX36ZdNlfU/7A9f3gUw49B3oQsvwBA==",
      "dev": true,
      "license": "BSD-2-Clause",
      "engines": {
        "node": ">=4.0"
      }
    },
    "node_modules/esutils": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/esutils/-/esutils-2.0.3.tgz",
      "integrity": "sha512-kVscqXk4OCp68SZ0dkgEKVi6/8ij300KBWTJq32P/dYeWTSwK41WyTxalN1eRmA5Z9UU/LX9D7FWSmV9SAYx6g==",
      "dev": true,
      "license": "BSD-2-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/eventemitter3": {
      "version": "5.0.4",
      "resolved": "https://registry.npmjs.org/eventemitter3/-/eventemitter3-5.0.4.tgz",
      "integrity": "sha512-mlsTRyGaPBjPedk6Bvw+aqbsXDtoAyAzm5MO7JgU+yVRyMQ5O8bD4Kcci7BS85f93veegeCPkL8R4GLClnjLFw=="
    },
    "node_modules/fast-deep-equal": {
      "version": "3.1.3",
      "resolved": "https://registry.npmjs.org/fast-deep-equal/-/fast-deep-equal-3.1.3.tgz",
      "integrity": "sha512-f3qQ9oQy9j2AhBe/H9VC91wLmKBCCU/gDOnKNAYG5hswO7BLKj09Hc5HYNz9cGI++xlpDCIgDaitVs03ATR84Q==",
      "dev": true
    },
    "node_modules/fast-glob": {
      "version": "3.3.1",
      "resolved": "https://registry.npmjs.org/fast-glob/-/fast-glob-3.3.1.tgz",
      "integrity": "sha512-kNFPyjhh5cKjrUltxs+wFx+ZkbRaxxmZ+X0ZU31SOsxCEtP9VPgtq2teZw1DebupL5GmDaNQ6yKMMVcM41iqDg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@nodelib/fs.stat": "^2.0.2",
        "@nodelib/fs.walk": "^1.2.3",
        "glob-parent": "^5.1.2",
        "merge2": "^1.3.0",
        "micromatch": "^4.0.4"
      },
      "engines": {
        "node": ">=8.6.0"
      }
    },
    "node_modules/fast-glob/node_modules/glob-parent": {
      "version": "5.1.2",
      "resolved": "https://registry.npmjs.org/glob-parent/-/glob-parent-5.1.2.tgz",
      "integrity": "sha512-AOIgSQCepiJYwP3ARnGx+5VnTu2HBYdzbGP45eLw1vr3zB3vZLeyed1sC9hnbcOc9/SrMyM5RPQrkGz4aS9Zow==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "is-glob": "^4.0.1"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/fast-json-stable-stringify": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/fast-json-stable-stringify/-/fast-json-stable-stringify-2.1.0.tgz",
      "integrity": "sha512-lhd/wF+Lk98HZoTCtlVraHtfh5XYijIjalXck7saUtuanSDyLMxnHhSXEDJqHxD7msR8D0uCmqlkwjCV8xvwHw==",
      "dev": true
    },
    "node_modules/fast-levenshtein": {
      "version": "2.0.6",
      "resolved": "https://registry.npmjs.org/fast-levenshtein/-/fast-levenshtein-2.0.6.tgz",
      "integrity": "sha512-DCXu6Ifhqcks7TZKY3Hxp3y6qphY5SJZmrWMDrKcERSOXWQdMhU9Ig/PYrzyw/ul9jOIyh0N4M0tbC5hodg8dw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/fastq": {
      "version": "1.20.1",
      "resolved": "https://registry.npmjs.org/fastq/-/fastq-1.20.1.tgz",
      "integrity": "sha512-GGToxJ/w1x32s/D2EKND7kTil4n8OVk/9mycTc4VDza13lOvpUZTGX3mFSCtV9ksdGBVzvsyAVLM6mHFThxXxw==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "reusify": "^1.0.4"
      }
    },
    "node_modules/file-entry-cache": {
      "version": "8.0.0",
      "resolved": "https://registry.npmjs.org/file-entry-cache/-/file-entry-cache-8.0.0.tgz",
      "integrity": "sha512-XXTUwCvisa5oacNGRP9SfNtYBNAMi+RPwBFmblZEF7N7swHYQS6/Zfk7SRwx4D5j3CH211YNRco1DEMNVfZCnQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "flat-cache": "^4.0.0"
      },
      "engines": {
        "node": ">=16.0.0"
      }
    },
    "node_modules/fill-range": {
      "version": "7.1.1",
      "resolved": "https://registry.npmjs.org/fill-range/-/fill-range-7.1.1.tgz",
      "integrity": "sha512-YsGpe3WHLK8ZYi4tWDg2Jy3ebRz2rXowDxnld4bkQB00cc/1Zw9AWnC0i9ztDJitivtQvaI9KaLyKrc+hBW0yg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "to-regex-range": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/find-up": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/find-up/-/find-up-5.0.0.tgz",
      "integrity": "sha512-78/PXT1wlLLDgTzDs7sjq9hzz0vXD+zn+7wypEe4fXQxCmdmqfGsEPQxmiCSQI3ajFV91bVSsvNtrJRiW6nGng==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "locate-path": "^6.0.0",
        "path-exists": "^4.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/flat-cache": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/flat-cache/-/flat-cache-4.0.1.tgz",
      "integrity": "sha512-f7ccFPK3SXFHpx15UIGyRJ/FJQctuKZ0zVuN3frBo4HnK3cay9VEW0R6yPYFHC0AgqhukPzKjq22t5DmAyqGyw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "flatted": "^3.2.9",
        "keyv": "^4.5.4"
      },
      "engines": {
        "node": ">=16"
      }
    },
    "node_modules/flatted": {
      "version": "3.4.2",
      "resolved": "https://registry.npmjs.org/flatted/-/flatted-3.4.2.tgz",
      "integrity": "sha512-PjDse7RzhcPkIJwy5t7KPWQSZ9cAbzQXcafsetQoD7sOJRQlGikNbx7yZp2OotDnJyrDcbyRq3Ttb18iYOqkxA==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/for-each": {
      "version": "0.3.5",
      "resolved": "https://registry.npmjs.org/for-each/-/for-each-0.3.5.tgz",
      "integrity": "sha512-dKx12eRCVIzqCxFGplyFKJMPvLEWgmNtUrpTiJIR5u97zEhRG8ySrtboPHZXx7daLxQVrl643cTzbab2tkQjxg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-callable": "^1.2.7"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/fraction.js": {
      "version": "5.3.4",
      "resolved": "https://registry.npmjs.org/fraction.js/-/fraction.js-5.3.4.tgz",
      "integrity": "sha512-1X1NTtiJphryn/uLQz3whtY6jK3fTqoE3ohKs0tT+Ujr1W59oopxmoEh7Lu5p6vBaPbgoM0bzveAW4Qi5RyWDQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "*"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/rawify"
      }
    },
    "node_modules/fsevents": {
      "version": "2.3.3",
      "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
      "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^8.16.0 || ^10.6.0 || >=11.0.0"
      }
    },
    "node_modules/function-bind": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/function-bind/-/function-bind-1.1.2.tgz",
      "integrity": "sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==",
      "dev": true,
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/function.prototype.name": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/function.prototype.name/-/function.prototype.name-1.2.0.tgz",
      "integrity": "sha512-jObKIik1P2QjPHP5nz5BaOtUlfgS0fWo8IUByNXkM+o+02sJOi94em77GwJKQSJ3gfPHdgzLNrHc1uokV4P/ew==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.9",
        "call-bound": "^1.0.4",
        "es-define-property": "^1.0.1",
        "es-errors": "^1.3.0",
        "functions-have-names": "^1.2.3",
        "has-property-descriptors": "^1.0.2",
        "hasown": "^2.0.4",
        "is-callable": "^1.2.7",
        "is-document.all": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/functions-have-names": {
      "version": "1.2.3",
      "resolved": "https://registry.npmjs.org/functions-have-names/-/functions-have-names-1.2.3.tgz",
      "integrity": "sha512-xckBUXyTIqT97tq2x2AMb+g163b5JFysYk0x4qxNFwbfQkmNZoiRHb6sPzI9/QV33WeuvVYBUIiD4NzNIyqaRQ==",
      "dev": true,
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/generator-function": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/generator-function/-/generator-function-2.0.1.tgz",
      "integrity": "sha512-SFdFmIJi+ybC0vjlHN0ZGVGHc3lgE0DxPAT0djjVg+kjOnSqclqmj0KQ7ykTOLP6YxoqOvuAODGdcHJn+43q3g==",
      "dev": true,
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/gensync": {
      "version": "1.0.0-beta.2",
      "resolved": "https://registry.npmjs.org/gensync/-/gensync-1.0.0-beta.2.tgz",
      "integrity": "sha512-3hN7NaskYvMDLQY55gnW3NQ+mesEAepTqlg+VEbj7zzqEMBVNhzcGYYeqFo/TlYz6eQiFcp1HcsCZO+nGgS8zg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/get-intrinsic": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/get-intrinsic/-/get-intrinsic-1.3.0.tgz",
      "integrity": "sha512-9fSjSaos/fRIVIp+xSJlE6lfwhES7LNtKaCBIamHsjr2na1BiABJPo0mOjjz8GJDURarmCPGqaiVg5mfjb98CQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.2",
        "es-define-property": "^1.0.1",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.1.1",
        "function-bind": "^1.1.2",
        "get-proto": "^1.0.1",
        "gopd": "^1.2.0",
        "has-symbols": "^1.1.0",
        "hasown": "^2.0.2",
        "math-intrinsics": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/get-proto": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/get-proto/-/get-proto-1.0.1.tgz",
      "integrity": "sha512-sTSfBjoXBp89JvIKIefqw7U2CCebsc74kiY6awiGogKtoSGbgjYE/G/+l9sF3MWFPNc9IcoOC4ODfKHfxFmp0g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "dunder-proto": "^1.0.1",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/get-symbol-description": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/get-symbol-description/-/get-symbol-description-1.1.0.tgz",
      "integrity": "sha512-w9UMqWwJxHNOvoNzSJ2oPF5wvYcvP7jUvYzhp67yEhTi17ZDBBC1z9pTdGuzjD+EFIqLSYRweZjqfiPzQ06Ebg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.6"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/get-tsconfig": {
      "version": "4.14.0",
      "resolved": "https://registry.npmjs.org/get-tsconfig/-/get-tsconfig-4.14.0.tgz",
      "integrity": "sha512-yTb+8DXzDREzgvYmh6s9vHsSVCHeC0G3PI5bEXNBHtmshPnO+S5O7qgLEOn0I5QvMy6kpZN8K1NKGyilLb93wA==",
      "dev": true,
      "dependencies": {
        "resolve-pkg-maps": "^1.0.0"
      },
      "funding": {
        "url": "https://github.com/privatenumber/get-tsconfig?sponsor=1"
      }
    },
    "node_modules/glob-parent": {
      "version": "6.0.2",
      "resolved": "https://registry.npmjs.org/glob-parent/-/glob-parent-6.0.2.tgz",
      "integrity": "sha512-XxwI8EOhVQgWp6iDL+3b0r86f4d6AX6zSU55HfB4ydCEuXLXc5FcYeOu+nnGftS4TEju/11rt4KJPTMgbfmv4A==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "is-glob": "^4.0.3"
      },
      "engines": {
        "node": ">=10.13.0"
      }
    },
    "node_modules/globals": {
      "version": "14.0.0",
      "resolved": "https://registry.npmjs.org/globals/-/globals-14.0.0.tgz",
      "integrity": "sha512-oahGvuMGQlPw/ivIYBjVSrWAfWLBeku5tpPE2fOPLi+WHffIWbuh2tCjhyQhTBPMf5E9jDEH4FOmTYgYwbKwtQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/globalthis": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/globalthis/-/globalthis-1.0.4.tgz",
      "integrity": "sha512-DpLKbNU4WylpxJykQujfCcwYWiV/Jhm50Goo0wrVILAv5jOr9d+H+UR3PhSCD2rCCEIg0uc+G+muBTwD54JhDQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "define-properties": "^1.2.1",
        "gopd": "^1.0.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/gopd": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/gopd/-/gopd-1.2.0.tgz",
      "integrity": "sha512-ZUKRh6/kUFoAiTAtTYPZJ3hw9wNxx+BIBOijnlG9PnrJsCcSjs1wyyD6vJpaYtgnzDrKYRSqf3OO6Rfa93xsRg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-bigints": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/has-bigints/-/has-bigints-1.1.0.tgz",
      "integrity": "sha512-R3pbpkcIqv2Pm3dUwgjclDRVmWpTJW2DcMzcIhEXEx1oh/CEMObMm3KLmRJOdvhM7o4uQBnwr8pzRK2sJWIqfg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-flag": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/has-flag/-/has-flag-4.0.0.tgz",
      "integrity": "sha512-EykJT/Q1KjTWctppgIAgfSO0tKVuZUjhgMr17kqTumMl6Afv3EISleU7qZUzoXDFTAHTDC4NOoG/ZxU3EvlMPQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/has-property-descriptors": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/has-property-descriptors/-/has-property-descriptors-1.0.2.tgz",
      "integrity": "sha512-55JNKuIW+vq4Ke1BjOTjM2YctQIvCT7GFzHwmfZPGo5wnrgkid0YQtnAleFSqumZm4az3n2BS+erby5ipJdgrg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-define-property": "^1.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-proto": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/has-proto/-/has-proto-1.2.0.tgz",
      "integrity": "sha512-KIL7eQPfHQRC8+XluaIw7BHUwwqL19bQn4hzNgdr+1wXoU0KKj6rufu47lhY7KbJR2C6T6+PfyN0Ea7wkSS+qQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "dunder-proto": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-symbols": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/has-symbols/-/has-symbols-1.1.0.tgz",
      "integrity": "sha512-1cDNdwJ2Jaohmb3sg4OmKaMBwuC48sYni5HUw2DvsC8LjGTLK9h+eb1X6RyuOHe4hT0ULCW68iomhjUoKUqlPQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-tostringtag": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/has-tostringtag/-/has-tostringtag-1.0.2.tgz",
      "integrity": "sha512-NqADB8VjPFLM2V0VvHUewwwsw0ZWBaIdgo+ieHtK3hasLz4qeCRjYcqfB6AQrBggRKppKF8L52/VqdVsO47Dlw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "has-symbols": "^1.0.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/hasown": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/hasown/-/hasown-2.0.4.tgz",
      "integrity": "sha512-T2UbfbBEF32wiepXIsMlTW9+dDYC6wMh/t/vYA4tuOMKqWz/n3vr1NFSxQiyP+zk2mXsoMA/i/7qV6LKut1t1A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/hermes-estree": {
      "version": "0.25.1",
      "resolved": "https://registry.npmjs.org/hermes-estree/-/hermes-estree-0.25.1.tgz",
      "integrity": "sha512-0wUoCcLp+5Ev5pDW2OriHC2MJCbwLwuRx+gAqMTOkGKJJiBCLjtrvy4PWUGn6MIVefecRpzoOZ/UV6iGdOr+Cw==",
      "dev": true
    },
    "node_modules/hermes-parser": {
      "version": "0.25.1",
      "resolved": "https://registry.npmjs.org/hermes-parser/-/hermes-parser-0.25.1.tgz",
      "integrity": "sha512-6pEjquH3rqaI6cYAXYPcz9MS4rY6R4ngRgrgfDshRptUZIc3lw0MCIJIGDj9++mfySOuPTHB4nrSW99BCvOPIA==",
      "dev": true,
      "dependencies": {
        "hermes-estree": "0.25.1"
      }
    },
    "node_modules/iceberg-js": {
      "version": "0.8.1",
      "resolved": "https://registry.npmjs.org/iceberg-js/-/iceberg-js-0.8.1.tgz",
      "integrity": "sha512-1dhVQZXhcHje7798IVM+xoo/1ZdVfzOMIc8/rgVSijRK38EDqOJoGula9N/8ZI5RD8QTxNQtK/Gozpr+qUqRRA==",
      "license": "MIT",
      "engines": {
        "node": ">=20.0.0"
      }
    },
    "node_modules/ignore": {
      "version": "5.3.2",
      "resolved": "https://registry.npmjs.org/ignore/-/ignore-5.3.2.tgz",
      "integrity": "sha512-hsBTNUqQTDwkWtcdYI2i06Y/nUBEsNEDJKjWdigLvegy8kDuJAS8uRlpkkcQpyEXL0Z/pjDy5HBmMjRCJ2gq+g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 4"
      }
    },
    "node_modules/immer": {
      "version": "10.2.0",
      "resolved": "https://registry.npmjs.org/immer/-/immer-10.2.0.tgz",
      "integrity": "sha512-d/+XTN3zfODyjr89gM3mPq1WNX2B8pYsu7eORitdwyA2sBubnTl3laYlBk4sXY5FUa5qTZGBDPJICVbvqzjlbw==",
      "license": "MIT",
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/immer"
      }
    },
    "node_modules/import-fresh": {
      "version": "3.3.1",
      "resolved": "https://registry.npmjs.org/import-fresh/-/import-fresh-3.3.1.tgz",
      "integrity": "sha512-TR3KfrTZTYLPB6jUjfx6MF9WcWrHL9su5TObK4ZkYgBdWKPOFoSoQIdEuTuR82pmtxH2spWG9h6etwfr1pLBqQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "parent-module": "^1.0.0",
        "resolve-from": "^4.0.0"
      },
      "engines": {
        "node": ">=6"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/imurmurhash": {
      "version": "0.1.4",
      "resolved": "https://registry.npmjs.org/imurmurhash/-/imurmurhash-0.1.4.tgz",
      "integrity": "sha512-JmXMZ6wuvDmLiHEml9ykzqO6lwFbof0GG4IkcGaENdCRDDmMVnny7s5HsIgHCbaq0w2MyPhDqkhTUgS2LU2PHA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.8.19"
      }
    },
    "node_modules/internal-slot": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/internal-slot/-/internal-slot-1.1.0.tgz",
      "integrity": "sha512-4gd7VpWNQNB4UKKCFFVcp1AVv+FMOgs9NKzjHKusc8jTMhd5eL1NqQqOpE0KzMds804/yHlglp3uxgluOqAPLw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "hasown": "^2.0.2",
        "side-channel": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/internmap": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/internmap/-/internmap-2.0.3.tgz",
      "integrity": "sha512-5Hh7Y1wQbvY5ooGgPbDaL5iYLAPzMTUrjMulskHLH6wnv/A+1q5rgEaiuqEjB+oxGXIVZs1FF+R/KPN3ZSQYYg==",
      "license": "ISC",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/is-array-buffer": {
      "version": "3.0.5",
      "resolved": "https://registry.npmjs.org/is-array-buffer/-/is-array-buffer-3.0.5.tgz",
      "integrity": "sha512-DDfANUiiG2wC1qawP66qlTugJeL5HyzMpfr8lLK+jMQirGzNod0B12cFB/9q838Ru27sBwfw78/rdoU7RERz6A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "call-bound": "^1.0.3",
        "get-intrinsic": "^1.2.6"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-async-function": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/is-async-function/-/is-async-function-2.1.1.tgz",
      "integrity": "sha512-9dgM/cZBnNvjzaMYHVoxxfPj2QXt22Ev7SuuPrs+xav0ukGB0S6d4ydZdEiM48kLx5kDV+QBPrpVnFyefL8kkQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "async-function": "^1.0.0",
        "call-bound": "^1.0.3",
        "get-proto": "^1.0.1",
        "has-tostringtag": "^1.0.2",
        "safe-regex-test": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-bigint": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/is-bigint/-/is-bigint-1.1.0.tgz",
      "integrity": "sha512-n4ZT37wG78iz03xPRKJrHTdZbe3IicyucEtdRsV5yglwc3GyUfbAfpSeD0FJ41NbUNSt5wbhqfp1fS+BgnvDFQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "has-bigints": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-binary-path": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/is-binary-path/-/is-binary-path-2.1.0.tgz",
      "integrity": "sha512-ZMERYes6pDydyuGidse7OsHxtbI7WVeUEozgR/g7rd0xUimYNlvZRE/K2MgZTjWy725IfelLeVcEM97mmtRGXw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "binary-extensions": "^2.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/is-boolean-object": {
      "version": "1.2.2",
      "resolved": "https://registry.npmjs.org/is-boolean-object/-/is-boolean-object-1.2.2.tgz",
      "integrity": "sha512-wa56o2/ElJMYqjCjGkXri7it5FbebW5usLw/nPmCMs5DeZ7eziSYZhSmPRn0txqeW4LnAmQQU7FgqLpsEFKM4A==",
      "dev": true,
      "dependencies": {
        "call-bound": "^1.0.3",
        "has-tostringtag": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-bun-module": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/is-bun-module/-/is-bun-module-2.0.0.tgz",
      "integrity": "sha512-gNCGbnnnnFAUGKeZ9PdbyeGYJqewpmc2aKHUEMO5nQPWU9lOmv7jcmQIv+qHD8fXW6W7qfuCwX4rY9LNRjXrkQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "semver": "^7.7.1"
      }
    },
    "node_modules/is-callable": {
      "version": "1.2.7",
      "resolved": "https://registry.npmjs.org/is-callable/-/is-callable-1.2.7.tgz",
      "integrity": "sha512-1BC0BVFhS/p0qtw6enp8e+8OD0UrK0oFLztSjNzhcKA3WDuJxxAPXzPuPtKkjEY9UUoEWlX/8fgKeu2S8i9JTA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-core-module": {
      "version": "2.16.2",
      "resolved": "https://registry.npmjs.org/is-core-module/-/is-core-module-2.16.2.tgz",
      "integrity": "sha512-evOr8xfXKxE6qSR0hSXL2r3sd7ALj8+7jQEUvPYcm5sgZFdJ+AYzT6yNmJenvIYQBgIGwfwz08sL8zoL7yq2BA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "hasown": "^2.0.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-data-view": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/is-data-view/-/is-data-view-1.0.2.tgz",
      "integrity": "sha512-RKtWF8pGmS87i2D6gqQu/l7EYRlVdfzemCJN/P3UOs//x1QE7mfhvzHIApBTRf7axvT6DMGwSwBXYCT0nfB9xw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "get-intrinsic": "^1.2.6",
        "is-typed-array": "^1.1.13"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-date-object": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/is-date-object/-/is-date-object-1.1.0.tgz",
      "integrity": "sha512-PwwhEakHVKTdRNVOw+/Gyh0+MzlCl4R6qKvkhuvLtPMggI1WAHt9sOwZxQLSGpUaDnrdyDsomoRgNnCfKNSXXg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "has-tostringtag": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-document.all": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/is-document.all/-/is-document.all-1.0.0.tgz",
      "integrity": "sha512-+XSoyS05OdBbhFuELhgTCpFNHkpBOJqtsZfUFFpe5QTw+9Sjbh8zitxhQkYAo6wV7e1Vb8cAPvpCk9jGam/82g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.4"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-extglob": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/is-extglob/-/is-extglob-2.1.1.tgz",
      "integrity": "sha512-SbKbANkN603Vi4jEZv49LeVJMn4yGwsbzZworEoyEiutsN3nJYdbO36zfhGJ6QEDpOZIFkDtnq5JRxmvl3jsoQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-finalizationregistry": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/is-finalizationregistry/-/is-finalizationregistry-1.1.1.tgz",
      "integrity": "sha512-1pC6N8qWJbWoPtEjgcL2xyhQOP491EQjeUo3qTKcmV8YSDDJrOepfG8pcC7h/QgnQHYSv0mJ3Z/ZWxmatVrysg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-generator-function": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/is-generator-function/-/is-generator-function-1.1.2.tgz",
      "integrity": "sha512-upqt1SkGkODW9tsGNG5mtXTXtECizwtS2kA161M+gJPc1xdb/Ax629af6YrTwcOeQHbewrPNlE5Dx7kzvXTizA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.4",
        "generator-function": "^2.0.0",
        "get-proto": "^1.0.1",
        "has-tostringtag": "^1.0.2",
        "safe-regex-test": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-glob": {
      "version": "4.0.3",
      "resolved": "https://registry.npmjs.org/is-glob/-/is-glob-4.0.3.tgz",
      "integrity": "sha512-xelSayHH36ZgE7ZWhli7pW34hNbNl8Ojv5KVmkJD4hBdD3th8Tfk9vYasLM+mXWOZhFkgZfxhLSnrwRr4elSSg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-extglob": "^2.1.1"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-map": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/is-map/-/is-map-2.0.3.tgz",
      "integrity": "sha512-1Qed0/Hr2m+YqxnM09CjA2d/i6YZNfF6R2oRAOj36eUdS6qIV/huPJNSEpKbupewFs+ZsJlxsjjPbc0/afW6Lw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-negative-zero": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/is-negative-zero/-/is-negative-zero-2.0.3.tgz",
      "integrity": "sha512-5KoIu2Ngpyek75jXodFvnafB6DJgr3u8uuK0LEZJjrU19DrMD3EVERaR8sjz8CCGgpZvxPl9SuE1GMVPFHx1mw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-number": {
      "version": "7.0.0",
      "resolved": "https://registry.npmjs.org/is-number/-/is-number-7.0.0.tgz",
      "integrity": "sha512-41Cifkg6e8TylSpdtTpeLVMqvSBEVzTttHvERD741+pnZ8ANv0004MRL43QKPDlK9cGvNp6NZWZUBlbGXYxxng==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.12.0"
      }
    },
    "node_modules/is-number-object": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/is-number-object/-/is-number-object-1.1.1.tgz",
      "integrity": "sha512-lZhclumE1G6VYD8VHe35wFaIif+CTy5SJIi5+3y4psDgWu4wPDoBhF8NxUOinEc7pHgiTsT6MaBb92rKhhD+Xw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "has-tostringtag": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-regex": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/is-regex/-/is-regex-1.2.1.tgz",
      "integrity": "sha512-MjYsKHO5O7mCsmRGxWcLWheFqN9DJ/2TmngvjKXihe6efViPqc274+Fx/4fYj/r03+ESvBdTXK0V6tA3rgez1g==",
      "dev": true,
      "dependencies": {
        "call-bound": "^1.0.2",
        "gopd": "^1.2.0",
        "has-tostringtag": "^1.0.2",
        "hasown": "^2.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-set": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/is-set/-/is-set-2.0.3.tgz",
      "integrity": "sha512-iPAjerrse27/ygGLxw+EBR9agv9Y6uLeYVJMu+QNCoouJ1/1ri0mGrcWpfCqFZuzzx3WjtwxG098X+n4OuRkPg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-shared-array-buffer": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/is-shared-array-buffer/-/is-shared-array-buffer-1.0.4.tgz",
      "integrity": "sha512-ISWac8drv4ZGfwKl5slpHG9OwPNty4jOWPRIhBpxOoD+hqITiwuipOQ2bNthAzwA3B4fIjO4Nln74N0S9byq8A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-string": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/is-string/-/is-string-1.1.1.tgz",
      "integrity": "sha512-BtEeSsoaQjlSPBemMQIrY1MY0uM6vnS1g5fmufYOtnxLGUZM2178PKbhsk7Ffv58IX+ZtcvoGwccYsh0PglkAA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "has-tostringtag": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-symbol": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/is-symbol/-/is-symbol-1.1.1.tgz",
      "integrity": "sha512-9gGx6GTtCQM73BgmHQXfDmLtfjjTUDSyoxTCbp5WtoixAhfgsDirWIcVQ/IHpvI5Vgd5i/J5F7B9cN/WlVbC/w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "has-symbols": "^1.1.0",
        "safe-regex-test": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-typed-array": {
      "version": "1.1.15",
      "resolved": "https://registry.npmjs.org/is-typed-array/-/is-typed-array-1.1.15.tgz",
      "integrity": "sha512-p3EcsicXjit7SaskXHs1hA91QxgTw46Fv6EFKKGS5DRFLD8yKnohjF3hxoju94b/OcMZoQukzpPpBE9uLVKzgQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "which-typed-array": "^1.1.16"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-weakmap": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/is-weakmap/-/is-weakmap-2.0.2.tgz",
      "integrity": "sha512-K5pXYOm9wqY1RgjpL3YTkF39tni1XajUIkawTLUo9EZEVUFga5gSQJF8nNS7ZwJQ02y+1YCNYcMh+HIf1ZqE+w==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-weakref": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/is-weakref/-/is-weakref-1.1.1.tgz",
      "integrity": "sha512-6i9mGWSlqzNMEqpCp93KwRS1uUOodk2OJ6b+sq7ZPDSy2WuI5NFIxp/254TytR8ftefexkWn5xNiHUNpPOfSew==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-weakset": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/is-weakset/-/is-weakset-2.0.4.tgz",
      "integrity": "sha512-mfcwb6IzQyOKTs84CQMrOwW4gQcaTOAWJ0zzJCl2WSPDrWk/OzDaImWFH3djXhb24g4eudZfLRozAvPGw4d9hQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "get-intrinsic": "^1.2.6"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/isarray": {
      "version": "2.0.5",
      "resolved": "https://registry.npmjs.org/isarray/-/isarray-2.0.5.tgz",
      "integrity": "sha512-xHjhDr3cNBK0BzdUJSPXZntQUx/mwMS5Rw4A7lPJ90XGAO6ISP/ePDNuo0vhqOZU+UD5JoodwCAAoZQd3FeAKw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/isexe": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/isexe/-/isexe-2.0.0.tgz",
      "integrity": "sha512-RHxMLp9lnKHGHRng9QFhRCMbYAcVpn69smSGcq3f36xjgVVWThj4qqLbTLlq7Ssj8B+fIQ1EuCEGI2lKsyQeIw==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/iterator.prototype": {
      "version": "1.1.5",
      "resolved": "https://registry.npmjs.org/iterator.prototype/-/iterator.prototype-1.1.5.tgz",
      "integrity": "sha512-H0dkQoCa3b2VEeKQBOxFph+JAbcrQdE7KC0UkqwpLmv2EC4P41QXP+rqo9wYodACiG5/WM5s9oDApTU8utwj9g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "define-data-property": "^1.1.4",
        "es-object-atoms": "^1.0.0",
        "get-intrinsic": "^1.2.6",
        "get-proto": "^1.0.0",
        "has-symbols": "^1.1.0",
        "set-function-name": "^2.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/jiti": {
      "version": "1.21.7",
      "resolved": "https://registry.npmjs.org/jiti/-/jiti-1.21.7.tgz",
      "integrity": "sha512-/imKNG4EbWNrVjoNC/1H5/9GFy+tqjGBHCaSsN+P2RnPqjsLmv6UD3Ej+Kj8nBWaRAwyk7kK5ZUc+OEatnTR3A==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "jiti": "bin/jiti.js"
      }
    },
    "node_modules/js-tokens": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/js-tokens/-/js-tokens-4.0.0.tgz",
      "integrity": "sha512-RdJUflcE3cUzKiMqQgsCu06FPu9UdIJO0beYbPhHN4k6apgJtifcoCtT9bcxOpYBtpD2kCM6Sbzg4CausW/PKQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/js-yaml": {
      "version": "4.2.0",
      "resolved": "https://registry.npmjs.org/js-yaml/-/js-yaml-4.2.0.tgz",
      "integrity": "sha512-ePWsvanv0DWuDRsW8dnt+R4jQ31SCRCQ7hhNcPXZPsoBZiemuZNYGf7adZdqX2D86j6rvKp3RpCxVTSb8WQlOw==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/puzrin"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/nodeca"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "argparse": "^2.0.1"
      },
      "bin": {
        "js-yaml": "bin/js-yaml.js"
      }
    },
    "node_modules/jsesc": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/jsesc/-/jsesc-3.1.0.tgz",
      "integrity": "sha512-/sM3dO2FOzXjKQhJuo0Q173wf2KOo8t4I8vHy6lF9poUp7bKT0/NHE8fPX23PwfhnykfqnC2xRxOnVw5XuGIaA==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "jsesc": "bin/jsesc"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/json-buffer": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/json-buffer/-/json-buffer-3.0.1.tgz",
      "integrity": "sha512-4bV5BfR2mqfQTJm+V5tPPdf+ZpuhiIvTuAB5g8kcrXOZpTT/QwwVRWBywX1ozr6lEuPdbHxwaJlm9G6mI2sfSQ==",
      "dev": true
    },
    "node_modules/json-schema-traverse": {
      "version": "0.4.1",
      "resolved": "https://registry.npmjs.org/json-schema-traverse/-/json-schema-traverse-0.4.1.tgz",
      "integrity": "sha512-xbbCH5dCYU5T8LcEhhuh7HJ88HXuW3qsI3Y0zOZFKfZEHcpWiHU/Jxzk629Brsab/mMiHQti9wMP+845RPe3Vg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/json-stable-stringify-without-jsonify": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/json-stable-stringify-without-jsonify/-/json-stable-stringify-without-jsonify-1.0.1.tgz",
      "integrity": "sha512-Bdboy+l7tA3OGW6FjyFHWkP5LuByj1Tk33Ljyq0axyzdk9//JSi2u3fP1QSmd1KNwq6VOKYGlAu87CisVir6Pw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/json5": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/json5/-/json5-1.0.2.tgz",
      "integrity": "sha512-g1MWMLBiz8FKi1e4w0UyVL3w+iJceWAFBAaBnnGKOpNa5f8TLktkbre1+s6oICydWAm+HRUGTmI+//xv2hvXYA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "minimist": "^1.2.0"
      },
      "bin": {
        "json5": "lib/cli.js"
      }
    },
    "node_modules/jsx-ast-utils": {
      "version": "3.3.5",
      "resolved": "https://registry.npmjs.org/jsx-ast-utils/-/jsx-ast-utils-3.3.5.tgz",
      "integrity": "sha512-ZZow9HBI5O6EPgSJLUb8n2NKgmVWTwCvHGwFuJlMjvLFqlGG6pjirPhtdsseaLZjSibD8eegzmYpUZwoIlj2cQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "array-includes": "^3.1.6",
        "array.prototype.flat": "^1.3.1",
        "object.assign": "^4.1.4",
        "object.values": "^1.1.6"
      },
      "engines": {
        "node": ">=4.0"
      }
    },
    "node_modules/keyv": {
      "version": "4.5.4",
      "resolved": "https://registry.npmjs.org/keyv/-/keyv-4.5.4.tgz",
      "integrity": "sha512-oxVHkHR/EJf2CNXnWxRLW6mg7JyCCUcG0DtEGmL2ctUo1PNTin1PUil+r/+4r5MpVgC/fn1kjsx7mjSujKqIpw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "json-buffer": "3.0.1"
      }
    },
    "node_modules/language-subtag-registry": {
      "version": "0.3.23",
      "resolved": "https://registry.npmjs.org/language-subtag-registry/-/language-subtag-registry-0.3.23.tgz",
      "integrity": "sha512-0K65Lea881pHotoGEa5gDlMxt3pctLi2RplBb7Ezh4rRdLEOtgi7n4EwK9lamnUCkKBqaeKRVebTq6BAxSkpXQ==",
      "dev": true,
      "license": "CC0-1.0"
    },
    "node_modules/language-tags": {
      "version": "1.0.9",
      "resolved": "https://registry.npmjs.org/language-tags/-/language-tags-1.0.9.tgz",
      "integrity": "sha512-MbjN408fEndfiQXbFQ1vnd+1NoLDsnQW41410oQBXiyXDMYH5z505juWa4KUE1LqxRC7DgOgZDbKLxHIwm27hA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "language-subtag-registry": "^0.3.20"
      },
      "engines": {
        "node": ">=0.10"
      }
    },
    "node_modules/levn": {
      "version": "0.4.1",
      "resolved": "https://registry.npmjs.org/levn/-/levn-0.4.1.tgz",
      "integrity": "sha512-+bT2uH4E5LGE7h/n3evcS/sQlJXCpIp6ym8OWJ5eV6+67Dsql/LaaT7qJBAt2rzfoa/5QBGBhxDix1dMt2kQKQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "prelude-ls": "^1.2.1",
        "type-check": "~0.4.0"
      },
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/lilconfig": {
      "version": "3.1.3",
      "resolved": "https://registry.npmjs.org/lilconfig/-/lilconfig-3.1.3.tgz",
      "integrity": "sha512-/vlFKAoH5Cgt3Ie+JLhRbwOsCQePABiU3tJ1egGvyQ+33R/vcwM2Zl2QR/LzjsBeItPt3oSVXapn+m4nQDvpzw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=14"
      },
      "funding": {
        "url": "https://github.com/sponsors/antonk52"
      }
    },
    "node_modules/lines-and-columns": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/lines-and-columns/-/lines-and-columns-1.2.4.tgz",
      "integrity": "sha512-7ylylesZQ/PV29jhEDl3Ufjo6ZX7gCqJr5F7PKrqc93v7fzSymt1BpwEU8nAUXs8qzzvqhbjhK5QZg6Mt/HkBg==",
      "dev": true
    },
    "node_modules/locate-path": {
      "version": "6.0.0",
      "resolved": "https://registry.npmjs.org/locate-path/-/locate-path-6.0.0.tgz",
      "integrity": "sha512-iPZK6eYjbxRu3uB4/WZ3EsEIMJFMqAoopl3R+zuq0UjcAm/MO6KCweDgPfP3elTztoKP3KtnVHxTn2NHBSDVUw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "p-locate": "^5.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/lodash.merge": {
      "version": "4.6.2",
      "resolved": "https://registry.npmjs.org/lodash.merge/-/lodash.merge-4.6.2.tgz",
      "integrity": "sha512-0KpjqXRVvrYyCsX1swR/XTK0va6VQkQM6MNo7PqW77ByjAhoARA8EfrP1N4+KlKj8YS0ZUCtRT/YUuhyYDujIQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/loose-envify": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/loose-envify/-/loose-envify-1.4.0.tgz",
      "integrity": "sha512-lyuxPGr/Wfhrlem2CL/UcnUc1zcqKAImBDzukY7Y5F/yQiNdko6+fRLevlw1HgMySw7f611UIY408EtxRSoK3Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "js-tokens": "^3.0.0 || ^4.0.0"
      },
      "bin": {
        "loose-envify": "cli.js"
      }
    },
    "node_modules/lru-cache": {
      "version": "5.1.1",
      "resolved": "https://registry.npmjs.org/lru-cache/-/lru-cache-5.1.1.tgz",
      "integrity": "sha512-KpNARQA3Iwv+jTA0utUVVbrh+Jlrr1Fv0e56GGzAFOXN7dk/FviaDW8LHmK52DlcH4WP2n6gI8vN1aesBFgo9w==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "yallist": "^3.0.2"
      }
    },
    "node_modules/lucide-react": {
      "version": "1.17.0",
      "resolved": "https://registry.npmjs.org/lucide-react/-/lucide-react-1.17.0.tgz",
      "integrity": "sha512-9FA9evdox/JQL5PT57fdA1x/yg8T7knJ98+zjTL3UfKza6pflQUUh3XtaQIHKvnsJw1lmsEyHVlt5jchYxOQ5w==",
      "license": "ISC",
      "peerDependencies": {
        "react": "^16.5.1 || ^17.0.0 || ^18.0.0 || ^19.0.0"
      }
    },
    "node_modules/math-intrinsics": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/math-intrinsics/-/math-intrinsics-1.1.0.tgz",
      "integrity": "sha512-/IXtbwEk5HTPyEwyKX6hGkYXxM9nbj64B+ilVJnC/R6B0pH5G4V3b0pVbL7DBj4tkhBAppbQUlf6F6Xl9LHu1g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/merge2": {
      "version": "1.4.1",
      "resolved": "https://registry.npmjs.org/merge2/-/merge2-1.4.1.tgz",
      "integrity": "sha512-8q7VEgMJW4J8tcfVPy8g09NcQwZdbwFEqhe/WZkoIzjn/3TGDwtOCYtXGxA3O8tPzpczCCDgv+P2P5y00ZJOOg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/micromatch": {
      "version": "4.0.8",
      "resolved": "https://registry.npmjs.org/micromatch/-/micromatch-4.0.8.tgz",
      "integrity": "sha512-PXwfBhYu0hBCPw8Dn0E+WDYb7af3dSLVWKi3HGv84IdF4TyFoC0ysxFd0Goxw7nSv4T/PzEJQxsYsEiFCKo2BA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "braces": "^3.0.3",
        "picomatch": "^2.3.1"
      },
      "engines": {
        "node": ">=8.6"
      }
    },
    "node_modules/minimatch": {
      "version": "3.1.5",
      "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-3.1.5.tgz",
      "integrity": "sha512-VgjWUsnnT6n+NUk6eZq77zeFdpW2LWDzP6zFGrCbHXiYNul5Dzqk2HHQ5uFH2DNW5Xbp8+jVzaeNt94ssEEl4w==",
      "dev": true,
      "dependencies": {
        "brace-expansion": "^1.1.7"
      },
      "engines": {
        "node": "*"
      }
    },
    "node_modules/minimist": {
      "version": "1.2.8",
      "resolved": "https://registry.npmjs.org/minimist/-/minimist-1.2.8.tgz",
      "integrity": "sha512-2yyAR8qBkN3YuheJanUpWC5U3bb5osDywNB8RzDVlDwDHbocAJveqqj1u8+SVD7jkWT4yvsHCpWqqWqAxb0zCA==",
      "dev": true,
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/mz": {
      "version": "2.7.0",
      "resolved": "https://registry.npmjs.org/mz/-/mz-2.7.0.tgz",
      "integrity": "sha512-z81GNO7nnYMEhrGh9LeymoE4+Yr0Wn5McHIZMK5cfQCl+NDX08sCZgUc9/6MHni9IWuFLm1Z3HTCXu2z9fN62Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "any-promise": "^1.0.0",
        "object-assign": "^4.0.1",
        "thenify-all": "^1.0.0"
      }
    },
    "node_modules/nanoid": {
      "version": "3.3.12",
      "resolved": "https://registry.npmjs.org/nanoid/-/nanoid-3.3.12.tgz",
      "integrity": "sha512-ZB9RH/39qpq5Vu6Y+NmUaFhQR6pp+M2Xt76XBnEwDaGcVAqhlvxrl3B2bKS5D3NH3QR76v3aSrKaF/Kiy7lEtQ==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "bin": {
        "nanoid": "bin/nanoid.cjs"
      },
      "engines": {
        "node": "^10 || ^12 || ^13.7 || ^14 || >=15.0.1"
      }
    },
    "node_modules/napi-postinstall": {
      "version": "0.3.4",
      "resolved": "https://registry.npmjs.org/napi-postinstall/-/napi-postinstall-0.3.4.tgz",
      "integrity": "sha512-PHI5f1O0EP5xJ9gQmFGMS6IZcrVvTjpXjz7Na41gTE7eE2hK11lg04CECCYEEjdc17EV4DO+fkGEtt7TpTaTiQ==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "napi-postinstall": "lib/cli.js"
      },
      "engines": {
        "node": "^12.20.0 || ^14.18.0 || >=16.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/napi-postinstall"
      }
    },
    "node_modules/natural-compare": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/natural-compare/-/natural-compare-1.4.0.tgz",
      "integrity": "sha512-OWND8ei3VtNC9h7V60qff3SVobHr996CTwgxubgyQYEpg290h9J0buyECNNJexkFm5sOajh5G116RYA1c8ZMSw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/next": {
      "version": "16.2.9",
      "resolved": "https://registry.npmjs.org/next/-/next-16.2.9.tgz",
      "integrity": "sha512-MEOJiq/UvuezAdqVSceHbqDgZt1kDw2tpGVOlsdIoJsQdbN2JY2hpVG4xnXGkbdJUOEWhnRfiu/O4Hpc9Juwww==",
      "dependencies": {
        "@next/env": "16.2.9",
        "@swc/helpers": "0.5.15",
        "baseline-browser-mapping": "^2.9.19",
        "caniuse-lite": "^1.0.30001579",
        "postcss": "8.4.31",
        "styled-jsx": "5.1.6"
      },
      "bin": {
        "next": "dist/bin/next"
      },
      "engines": {
        "node": ">=20.9.0"
      },
      "optionalDependencies": {
        "@next/swc-darwin-arm64": "16.2.9",
        "@next/swc-darwin-x64": "16.2.9",
        "@next/swc-linux-arm64-gnu": "16.2.9",
        "@next/swc-linux-arm64-musl": "16.2.9",
        "@next/swc-linux-x64-gnu": "16.2.9",
        "@next/swc-linux-x64-musl": "16.2.9",
        "@next/swc-win32-arm64-msvc": "16.2.9",
        "@next/swc-win32-x64-msvc": "16.2.9",
        "sharp": "^0.34.5"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.1.0",
        "@playwright/test": "^1.51.1",
        "babel-plugin-react-compiler": "*",
        "react": "^18.2.0 || 19.0.0-rc-de68d2f4-20241204 || ^19.0.0",
        "react-dom": "^18.2.0 || 19.0.0-rc-de68d2f4-20241204 || ^19.0.0",
        "sass": "^1.3.0"
      },
      "peerDependenciesMeta": {
        "@opentelemetry/api": {
          "optional": true
        },
        "@playwright/test": {
          "optional": true
        },
        "babel-plugin-react-compiler": {
          "optional": true
        },
        "sass": {
          "optional": true
        }
      }
    },
    "node_modules/node-exports-info": {
      "version": "1.6.0",
      "resolved": "https://registry.npmjs.org/node-exports-info/-/node-exports-info-1.6.0.tgz",
      "integrity": "sha512-pyFS63ptit/P5WqUkt+UUfe+4oevH+bFeIiPPdfb0pFeYEu/1ELnJu5l+5EcTKYL5M7zaAa7S8ddywgXypqKCw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "array.prototype.flatmap": "^1.3.3",
        "es-errors": "^1.3.0",
        "object.entries": "^1.1.9",
        "semver": "^6.3.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/node-exports-info/node_modules/semver": {
      "version": "6.3.1",
      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",
      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",
      "dev": true,
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      }
    },
    "node_modules/node-releases": {
      "version": "2.0.47",
      "resolved": "https://registry.npmjs.org/node-releases/-/node-releases-2.0.47.tgz",
      "integrity": "sha512-Uzmd6LXpouKo8EUK68IjH4+E01w/hXyV3R3g/geCJo+rXLNfh1xucB+LOzYEOQPSiUK3h/xZf0cQGcSsmyL2Og==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/normalize-path": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/normalize-path/-/normalize-path-3.0.0.tgz",
      "integrity": "sha512-6eZs5Ls3WtCisHWp9S2GUy8dqkpGi4BVSz3GaqiE6ezub0512ESztXUwUB6C6IKbQkY2Pnb/mD4WYojCRwcwLA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/object-assign": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/object-assign/-/object-assign-4.1.1.tgz",
      "integrity": "sha512-rJgTQnkUnH1sFw8yT6VSU3zD3sWmu6sZhIseY8VX+GRu3P6F7Fu+JNDoXfklElbLJSnc3FUQHVe4cU5hj+BcUg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/object-hash": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/object-hash/-/object-hash-3.0.0.tgz",
      "integrity": "sha512-RSn9F68PjH9HqtltsSnqYC1XXoWe9Bju5+213R98cNGttag9q9yAOTzdbsqvIa7aNm5WffBZFpWYr2aWrklWAw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/object-inspect": {
      "version": "1.13.4",
      "resolved": "https://registry.npmjs.org/object-inspect/-/object-inspect-1.13.4.tgz",
      "integrity": "sha512-W67iLl4J2EXEGTbfeHCffrjDfitvLANg0UlX3wFUUSTx92KXRFegMHUVgSqE+wvhAbi4WqjGg9czysTV2Epbew==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/object-keys": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/object-keys/-/object-keys-1.1.1.tgz",
      "integrity": "sha512-NuAESUOUMrlIXOfHKzD6bpPu3tYt3xvjNdRIQ+FeT0lNb4K8WR70CaDxhuNguS2XG+GjkyMwOzsN5ZktImfhLA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/object.assign": {
      "version": "4.1.7",
      "resolved": "https://registry.npmjs.org/object.assign/-/object.assign-4.1.7.tgz",
      "integrity": "sha512-nK28WOo+QIjBkDduTINE4JkF/UJJKyf2EJxvJKfblDpyg0Q+pkOHNTL0Qwy6NP6FhE/EnzV73BxxqcJaXY9anw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "call-bound": "^1.0.3",
        "define-properties": "^1.2.1",
        "es-object-atoms": "^1.0.0",
        "has-symbols": "^1.1.0",
        "object-keys": "^1.1.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/object.entries": {
      "version": "1.1.9",
      "resolved": "https://registry.npmjs.org/object.entries/-/object.entries-1.1.9.tgz",
      "integrity": "sha512-8u/hfXFRBD1O0hPUjioLhoWFHRmt6tKA4/vZPyckBr18l1KE9uHrFaFaUi8MDRTpi4uak2goyPTSNJLXX2k2Hw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "call-bound": "^1.0.4",
        "define-properties": "^1.2.1",
        "es-object-atoms": "^1.1.1"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/object.fromentries": {
      "version": "2.0.8",
      "resolved": "https://registry.npmjs.org/object.fromentries/-/object.fromentries-2.0.8.tgz",
      "integrity": "sha512-k6E21FzySsSK5a21KRADBd/NGneRegFO5pLHfdQLpRDETUNJueLXs3WCzyQ3tFRDYgbq3KHGXfTbi2bs8WQ6rQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.7",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.2",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/object.groupby": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/object.groupby/-/object.groupby-1.0.3.tgz",
      "integrity": "sha512-+Lhy3TQTuzXI5hevh8sBGqbmurHbbIjAi0Z4S63nthVLmLxfbj4T54a4CfZrXIrt9iP4mVAPYMo/v99taj3wjQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.7",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/object.values": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/object.values/-/object.values-1.2.1.tgz",
      "integrity": "sha512-gXah6aZrcUxjWg2zR2MwouP2eHlCBzdV4pygudehaKXSGW4v2AsRQUK+lwwXhii6KFZcunEnmSUoYp5CXibxtA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "call-bound": "^1.0.3",
        "define-properties": "^1.2.1",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/optionator": {
      "version": "0.9.4",
      "resolved": "https://registry.npmjs.org/optionator/-/optionator-0.9.4.tgz",
      "integrity": "sha512-6IpQ7mKUxRcZNLIObR0hz7lxsapSSIYNZJwXPGeF0mTVqGKFIXj1DQcMoT22S3ROcLyY/rz0PWaWZ9ayWmad9g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "deep-is": "^0.1.3",
        "fast-levenshtein": "^2.0.6",
        "levn": "^0.4.1",
        "prelude-ls": "^1.2.1",
        "type-check": "^0.4.0",
        "word-wrap": "^1.2.5"
      },
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/own-keys": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/own-keys/-/own-keys-1.0.1.tgz",
      "integrity": "sha512-qFOyK5PjiWZd+QQIh+1jhdb9LpxTF0qs7Pm8o5QHYZ0M3vKqSqzsZaEB6oWlxZ+q2sJBMI/Ktgd2N5ZwQoRHfg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "get-intrinsic": "^1.2.6",
        "object-keys": "^1.1.1",
        "safe-push-apply": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/p-limit": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/p-limit/-/p-limit-3.1.0.tgz",
      "integrity": "sha512-TYOanM3wGwNGsZN2cVTYPArw454xnXj5qmWF1bEoAc4+cU/ol7GVh7odevjp1FNHduHc3KZMcFduxU5Xc6uJRQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "yocto-queue": "^0.1.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/p-locate": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/p-locate/-/p-locate-5.0.0.tgz",
      "integrity": "sha512-LaNjtRWUBY++zB5nE/NwcaoMylSPk+S+ZHNB1TzdbMJMny6dynpAGt7X/tl/QYq3TIeE6nxHppbo2LGymrG5Pw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "p-limit": "^3.0.2"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/parent-module": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/parent-module/-/parent-module-1.0.1.tgz",
      "integrity": "sha512-GQ2EWRpQV8/o+Aw8YqtfZZPfNRWZYkbidE9k5rpl/hC3vtHHBfGm2Ifi6qWV+coDGkrUKZAxE3Lot5kcsRlh+g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "callsites": "^3.0.0"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/path-exists": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/path-exists/-/path-exists-4.0.0.tgz",
      "integrity": "sha512-ak9Qy5Q7jYb2Wwcey5Fpvg2KoAc/ZIhLSLOSBmRmygPsGwkVVt0fZa0qrtMz+m6tJTAHfZQ8FnmB4MG4LWy7/w==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/path-key": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/path-key/-/path-key-3.1.1.tgz",
      "integrity": "sha512-ojmeN0qd+y0jszEtoY48r0Peq5dwMEkIlCOu6Q5f41lfkswXuKtYrhgoTpLnyIcHm24Uhqx+5Tqm2InSwLhE6Q==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/path-parse": {
      "version": "1.0.7",
      "resolved": "https://registry.npmjs.org/path-parse/-/path-parse-1.0.7.tgz",
      "integrity": "sha512-LDJzPVEEEPR+y48z93A0Ed0yXb8pAByGWo/k5YYdYgpY2/2EsOsksJrq7lOHxryrVOn1ejG6oAp8ahvOIQD8sw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/picocolors": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/picocolors/-/picocolors-1.1.1.tgz",
      "integrity": "sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==",
      "license": "ISC"
    },
    "node_modules/picomatch": {
      "version": "2.3.2",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-2.3.2.tgz",
      "integrity": "sha512-V7+vQEJ06Z+c5tSye8S+nHUfI51xoXIXjHQ99cQtKUkQqqO1kO/KCJUfZXuB47h/YBlDhah2H3hdUGXn8ie0oA==",
      "dev": true,
      "engines": {
        "node": ">=8.6"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/pify": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/pify/-/pify-2.3.0.tgz",
      "integrity": "sha512-udgsAY+fTnvv7kI7aaxbqwWNb0AHiB0qBO89PZKPkoTmGOgdbrHDKD+0B2X4uTfJ/FT1R09r9gTsjUjNJotuog==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/pirates": {
      "version": "4.0.7",
      "resolved": "https://registry.npmjs.org/pirates/-/pirates-4.0.7.tgz",
      "integrity": "sha512-TfySrs/5nm8fQJDcBDuUng3VOUKsd7S+zqvbOTiGXHfxX4wK31ard+hoNuvkicM/2YFzlpDgABOevKSsB4G/FA==",
      "dev": true,
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/possible-typed-array-names": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/possible-typed-array-names/-/possible-typed-array-names-1.1.0.tgz",
      "integrity": "sha512-/+5VFTchJDoVj3bhoqi6UeymcD00DAwb1nJwamzPvHEszJ4FpF6SNNbUbOS8yI56qHzdV8eK0qEfOSiodkTdxg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/postcss": {
      "version": "8.5.15",
      "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.5.15.tgz",
      "integrity": "sha512-FfR8sjd4em2T6fb3I2MwAJU7HWVMr9zba+enmQeeWFfCbm+UOC/0X4DS8XtpUTMwWMGbjKYP7xjfNekzyGmB3A==",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/postcss"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "dependencies": {
        "nanoid": "^3.3.12",
        "picocolors": "^1.1.1",
        "source-map-js": "^1.2.1"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      }
    },
    "node_modules/postcss-import": {
      "version": "15.1.0",
      "resolved": "https://registry.npmjs.org/postcss-import/-/postcss-import-15.1.0.tgz",
      "integrity": "sha512-hpr+J05B2FVYUAXHeK1YyI267J/dDDhMU6B6civm8hSY1jYJnBXxzKDKDswzJmtLHryrjhnDjqqp/49t8FALew==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "postcss-value-parser": "^4.0.0",
        "read-cache": "^1.0.0",
        "resolve": "^1.1.7"
      },
      "engines": {
        "node": ">=14.0.0"
      },
      "peerDependencies": {
        "postcss": "^8.0.0"
      }
    },
    "node_modules/postcss-import/node_modules/resolve": {
      "version": "1.22.12",
      "resolved": "https://registry.npmjs.org/resolve/-/resolve-1.22.12.tgz",
      "integrity": "sha512-TyeJ1zif53BPfHootBGwPRYT1RUt6oGWsaQr8UyZW/eAm9bKoijtvruSDEmZHm92CwS9nj7/fWttqPCgzep8CA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "is-core-module": "^2.16.1",
        "path-parse": "^1.0.7",
        "supports-preserve-symlinks-flag": "^1.0.0"
      },
      "bin": {
        "resolve": "bin/resolve"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/postcss-js": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/postcss-js/-/postcss-js-4.1.0.tgz",
      "integrity": "sha512-oIAOTqgIo7q2EOwbhb8UalYePMvYoIeRY2YKntdpFQXNosSu3vLrniGgmH9OKs/qAkfoj5oB3le/7mINW1LCfw==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "dependencies": {
        "camelcase-css": "^2.0.1"
      },
      "engines": {
        "node": "^12 || ^14 || >= 16"
      },
      "peerDependencies": {
        "postcss": "^8.4.21"
      }
    },
    "node_modules/postcss-load-config": {
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/postcss-load-config/-/postcss-load-config-6.0.1.tgz",
      "integrity": "sha512-oPtTM4oerL+UXmx+93ytZVN82RrlY/wPUV8IeDxFrzIjXOLF1pN+EmKPLbubvKHT2HC20xXsCAH2Z+CKV6Oz/g==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "lilconfig": "^3.1.1"
      },
      "engines": {
        "node": ">= 18"
      },
      "peerDependencies": {
        "jiti": ">=1.21.0",
        "postcss": ">=8.0.9",
        "tsx": "^4.8.1",
        "yaml": "^2.4.2"
      },
      "peerDependenciesMeta": {
        "jiti": {
          "optional": true
        },
        "postcss": {
          "optional": true
        },
        "tsx": {
          "optional": true
        },
        "yaml": {
          "optional": true
        }
      }
    },
    "node_modules/postcss-nested": {
      "version": "6.2.0",
      "resolved": "https://registry.npmjs.org/postcss-nested/-/postcss-nested-6.2.0.tgz",
      "integrity": "sha512-HQbt28KulC5AJzG+cZtj9kvKB93CFCdLvog1WFLf1D+xmMvPGlBstkpTEZfK5+AN9hfJocyBFCNiqyS48bpgzQ==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "postcss-selector-parser": "^6.1.1"
      },
      "engines": {
        "node": ">=12.0"
      },
      "peerDependencies": {
        "postcss": "^8.2.14"
      }
    },
    "node_modules/postcss-selector-parser": {
      "version": "6.1.4",
      "resolved": "https://registry.npmjs.org/postcss-selector-parser/-/postcss-selector-parser-6.1.4.tgz",
      "integrity": "sha512-bIoJLOmjCO1S9XdY/DcnR5hJxvrDir1PbGChrzXG3vw0/FOliy/fA3dmdhQ441kah4gKv+TwckGzex6wNS5cnQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "cssesc": "^3.0.0",
        "util-deprecate": "^1.0.2"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/postcss-value-parser": {
      "version": "4.2.0",
      "resolved": "https://registry.npmjs.org/postcss-value-parser/-/postcss-value-parser-4.2.0.tgz",
      "integrity": "sha512-1NNCs6uurfkVbeXG4S8JFT9t19m45ICnif8zWLd5oPSZ50QnwMfK+H3jv408d4jw/7Bttv5axS5IiHoLaVNHeQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/prelude-ls": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/prelude-ls/-/prelude-ls-1.2.1.tgz",
      "integrity": "sha512-vkcDPrRZo1QZLbn5RLGPpg/WmIQ65qoWWhcGKf/b5eplkkarX0m9z8ppCat4mlOqUsWpyNuYgO3VRyrYHSzX5g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/prop-types": {
      "version": "15.8.1",
      "resolved": "https://registry.npmjs.org/prop-types/-/prop-types-15.8.1.tgz",
      "integrity": "sha512-oj87CgZICdulUohogVAR7AjlC0327U4el4L6eAvOqCeudMDVU0NThNaV+b9Df4dXgSP1gXMTnPdhfe/2qDH5cg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "loose-envify": "^1.4.0",
        "object-assign": "^4.1.1",
        "react-is": "^16.13.1"
      }
    },
    "node_modules/punycode": {
      "version": "2.3.1",
      "resolved": "https://registry.npmjs.org/punycode/-/punycode-2.3.1.tgz",
      "integrity": "sha512-vYt7UD1U9Wg6138shLtLOvdAu+8DsC/ilFtEVHcH+wydcSpNE20AfSOduf6MkRFahL5FY7X1oU7nKVZFtfq8Fg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/queue-microtask": {
      "version": "1.2.3",
      "resolved": "https://registry.npmjs.org/queue-microtask/-/queue-microtask-1.2.3.tgz",
      "integrity": "sha512-NuaNSa6flKT5JaSYQzJok04JzTL1CA6aGhv5rfLW3PgqA+M2ChpZQnAC8h8i4ZFkBS8X5RqkDBHA7r4hej3K9A==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ]
    },
    "node_modules/react": {
      "version": "19.2.7",
      "resolved": "https://registry.npmjs.org/react/-/react-19.2.7.tgz",
      "integrity": "sha512-HNe9WslTbXmFK8o8cmwgAeJFSBvt1bPdHCVKtaaV+WlAN36mpT4hcRpwbf3fY56ar2oIXzsBpOAiIRHAdY0OlQ==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/react-dom": {
      "version": "19.2.7",
      "resolved": "https://registry.npmjs.org/react-dom/-/react-dom-19.2.7.tgz",
      "integrity": "sha512-t0BRVXvbiE/o20Hfw669rLbMCDWtYZLvmJigy2f0MxsXF+71pxhR3xOkspmsO8h3ZlNzyibAmtCa3l4lYKk6gQ==",
      "license": "MIT",
      "dependencies": {
        "scheduler": "^0.27.0"
      },
      "peerDependencies": {
        "react": "^19.2.7"
      }
    },
    "node_modules/react-is": {
      "version": "16.13.1",
      "resolved": "https://registry.npmjs.org/react-is/-/react-is-16.13.1.tgz",
      "integrity": "sha512-24e6ynE2H+OKt4kqsOvNd8kBpV65zoxbA4BVsEOB3ARVWQki/DHzaUoC5KuON/BiccDaCCTZBuOcfZs70kR8bQ==",
      "license": "MIT"
    },
    "node_modules/react-redux": {
      "version": "9.3.0",
      "resolved": "https://registry.npmjs.org/react-redux/-/react-redux-9.3.0.tgz",
      "integrity": "sha512-KQopgqFo/p/fgmAs5qz6p5RWaNAzq40WAu7fJIXnQpYxFPbJYtsJPWvGeF2rOBaY/kEuV77AVsX8TsQzKm+A/g==",
      "license": "MIT",
      "dependencies": {
        "@types/use-sync-external-store": "^0.0.6",
        "use-sync-external-store": "^1.4.0"
      },
      "peerDependencies": {
        "@types/react": "^18.2.25 || ^19",
        "react": "^18.0 || ^19",
        "redux": "^5.0.0"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "redux": {
          "optional": true
        }
      }
    },
    "node_modules/read-cache": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/read-cache/-/read-cache-1.0.0.tgz",
      "integrity": "sha512-Owdv/Ft7IjOgm/i0xvNDZ1LrRANRfew4b2prF3OWMQLxLfu3bS8FVhCsrSCMK4lR56Y9ya+AThoTpDCTxCmpRA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "pify": "^2.3.0"
      }
    },
    "node_modules/readdirp": {
      "version": "3.6.0",
      "resolved": "https://registry.npmjs.org/readdirp/-/readdirp-3.6.0.tgz",
      "integrity": "sha512-hOS089on8RduqdbhvQ5Z37A0ESjsqz6qnRcffsMU3495FuTdqSm+7bhJ29JvIOsBDEEnan5DPu9t3To9VRlMzA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "picomatch": "^2.2.1"
      },
      "engines": {
        "node": ">=8.10.0"
      }
    },
    "node_modules/recharts": {
      "version": "3.8.1",
      "resolved": "https://registry.npmjs.org/recharts/-/recharts-3.8.1.tgz",
      "integrity": "sha512-mwzmO1s9sFL0TduUpwndxCUNoXsBw3u3E/0+A+cLcrSfQitSG62L32N69GhqUrrT5qKcAE3pCGVINC6pqkBBQg==",
      "dependencies": {
        "@reduxjs/toolkit": "^1.9.0 || 2.x.x",
        "clsx": "^2.1.1",
        "decimal.js-light": "^2.5.1",
        "es-toolkit": "^1.39.3",
        "eventemitter3": "^5.0.1",
        "immer": "^10.1.1",
        "react-redux": "8.x.x || 9.x.x",
        "reselect": "5.1.1",
        "tiny-invariant": "^1.3.3",
        "use-sync-external-store": "^1.2.2",
        "victory-vendor": "^37.0.2"
      },
      "engines": {
        "node": ">=18"
      },
      "peerDependencies": {
        "react": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0",
        "react-dom": "^16.0.0 || ^17.0.0 || ^18.0.0 || ^19.0.0",
        "react-is": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0"
      }
    },
    "node_modules/redux": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/redux/-/redux-5.0.1.tgz",
      "integrity": "sha512-M9/ELqF6fy8FwmkpnF0S3YKOqMyoWJ4+CS5Efg2ct3oY9daQvd/Pc71FpGZsVsbl3Cpb+IIcjBDUnnyBdQbq4w=="
    },
    "node_modules/redux-thunk": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/redux-thunk/-/redux-thunk-3.1.0.tgz",
      "integrity": "sha512-NW2r5T6ksUKXCabzhL9z+h206HQw/NJkcLm1GPImRQ8IzfXwRGqjVhKJGauHirT0DAuyy6hjdnMZaRoAcy0Klw==",
      "license": "MIT",
      "peerDependencies": {
        "redux": "^5.0.0"
      }
    },
    "node_modules/reflect.getprototypeof": {
      "version": "1.0.10",
      "resolved": "https://registry.npmjs.org/reflect.getprototypeof/-/reflect.getprototypeof-1.0.10.tgz",
      "integrity": "sha512-00o4I+DVrefhv+nX0ulyi3biSHCPDe+yLv5o/p6d/UVlirijB8E16FtfwSAi4g3tcqrQ4lRAqQSoFEZJehYEcw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.9",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.0.0",
        "get-intrinsic": "^1.2.7",
        "get-proto": "^1.0.1",
        "which-builtin-type": "^1.2.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/regexp.prototype.flags": {
      "version": "1.5.4",
      "resolved": "https://registry.npmjs.org/regexp.prototype.flags/-/regexp.prototype.flags-1.5.4.tgz",
      "integrity": "sha512-dYqgNSZbDwkaJ2ceRd9ojCGjBq+mOm9LmtXnAnEGyHhN/5R7iDW2TRw3h+o/jCFxus3P2LfWIIiwowAjANm7IA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "define-properties": "^1.2.1",
        "es-errors": "^1.3.0",
        "get-proto": "^1.0.1",
        "gopd": "^1.2.0",
        "set-function-name": "^2.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/reselect": {
      "version": "5.1.1",
      "resolved": "https://registry.npmjs.org/reselect/-/reselect-5.1.1.tgz",
      "integrity": "sha512-K/BG6eIky/SBpzfHZv/dd+9JBFiS4SWV7FIujVyJRux6e45+73RaUHXLmIR1f7WOMaQ0U1km6qwklRQxpJJY0w==",
      "license": "MIT"
    },
    "node_modules/resolve": {
      "version": "2.0.0-next.7",
      "resolved": "https://registry.npmjs.org/resolve/-/resolve-2.0.0-next.7.tgz",
      "integrity": "sha512-tqt+NBWwyaMgw3zDsnygx4CByWjQEJHOPMdslYhppaQSJUtL/D4JO9CcBBlhPoI8lz9oJIDXkwXfhF4aWqP8xQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "is-core-module": "^2.16.2",
        "node-exports-info": "^1.6.0",
        "object-keys": "^1.1.1",
        "path-parse": "^1.0.7",
        "supports-preserve-symlinks-flag": "^1.0.0"
      },
      "bin": {
        "resolve": "bin/resolve"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/resolve-from": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/resolve-from/-/resolve-from-4.0.0.tgz",
      "integrity": "sha512-pb/MYmXstAkysRFx8piNI1tGFNQIFA3vkE3Gq4EuA1dF6gHp/+vgZqsCGJapvy8N3Q+4o7FwvquPJcnZ7RYy4g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/resolve-pkg-maps": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/resolve-pkg-maps/-/resolve-pkg-maps-1.0.0.tgz",
      "integrity": "sha512-seS2Tj26TBVOC2NIc2rOe2y2ZO7efxITtLZcGSOnHHNOQ7CkiUBfw0Iw2ck6xkIhPwLhKNLS8BO+hEpngQlqzw==",
      "dev": true,
      "license": "MIT",
      "funding": {
        "url": "https://github.com/privatenumber/resolve-pkg-maps?sponsor=1"
      }
    },
    "node_modules/reusify": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/reusify/-/reusify-1.1.0.tgz",
      "integrity": "sha512-g6QUff04oZpHs0eG5p83rFLhHeV00ug/Yf9nZM6fLeUrPguBTkTQOdpAWWspMh55TZfVQDPaN3NQJfbVRAxdIw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "iojs": ">=1.0.0",
        "node": ">=0.10.0"
      }
    },
    "node_modules/run-parallel": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/run-parallel/-/run-parallel-1.2.0.tgz",
      "integrity": "sha512-5l4VyZR86LZ/lDxZTR6jqL8AFE2S0IFLMP26AbjsLVADxHdhB/c0GUsH+y39UfCi3dzz8OlQuPmnaJOMoDHQBA==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "queue-microtask": "^1.2.2"
      }
    },
    "node_modules/safe-array-concat": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/safe-array-concat/-/safe-array-concat-1.1.4.tgz",
      "integrity": "sha512-wtZlHyOje6OZTGqAoaDKxFkgRtkF9CnHAVnCHKfuj200wAgL+bSJhdsCD2l0Qx/2ekEXjPWcyKkfGb5CPboslg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.9",
        "call-bound": "^1.0.4",
        "get-intrinsic": "^1.3.0",
        "has-symbols": "^1.1.0",
        "isarray": "^2.0.5"
      },
      "engines": {
        "node": ">=0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/safe-push-apply": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/safe-push-apply/-/safe-push-apply-1.0.0.tgz",
      "integrity": "sha512-iKE9w/Z7xCzUMIZqdBsp6pEQvwuEebH4vdpjcDWnyzaI6yl6O9FHvVpmGelvEHNsoY6wGblkxR6Zty/h00WiSA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "isarray": "^2.0.5"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/safe-regex-test": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/safe-regex-test/-/safe-regex-test-1.1.0.tgz",
      "integrity": "sha512-x/+Cz4YrimQxQccJf5mKEbIa1NzeCRNI5Ecl/ekmlYaampdNLPalVyIcCZNNH3MvmqBugV5TMYZXv0ljslUlaw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "is-regex": "^1.2.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/scheduler": {
      "version": "0.27.0",
      "resolved": "https://registry.npmjs.org/scheduler/-/scheduler-0.27.0.tgz",
      "integrity": "sha512-eNv+WrVbKu1f3vbYJT/xtiF5syA5HPIMtf9IgY/nKg0sWqzAUEvqY/xm7OcZc/qafLx/iO9FgOmeSAp4v5ti/Q==",
      "license": "MIT"
    },
    "node_modules/semver": {
      "version": "7.8.4",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.8.4.tgz",
      "integrity": "sha512-rUCObTnP32Q08R2uuIrt7r9PlEonuTmtuXYcW6s5kjdlj3xbnwe+21yXptAUYcMAABLkYYTtnmzb3w3EDZfueA==",
      "devOptional": true,
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/set-function-length": {
      "version": "1.2.2",
      "resolved": "https://registry.npmjs.org/set-function-length/-/set-function-length-1.2.2.tgz",
      "integrity": "sha512-pgRc4hJ4/sNjWCSS9AmnS40x3bNMDTknHgL5UaMBTMyJnU90EgWh1Rz+MC9eFu4BuN/UwZjKQuY/1v3rM7HMfg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "define-data-property": "^1.1.4",
        "es-errors": "^1.3.0",
        "function-bind": "^1.1.2",
        "get-intrinsic": "^1.2.4",
        "gopd": "^1.0.1",
        "has-property-descriptors": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/set-function-name": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/set-function-name/-/set-function-name-2.0.2.tgz",
      "integrity": "sha512-7PGFlmtwsEADb0WYyvCMa1t+yke6daIG4Wirafur5kcf+MhUnPms1UeR0CKQdTZD81yESwMHbtn+TR+dMviakQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "define-data-property": "^1.1.4",
        "es-errors": "^1.3.0",
        "functions-have-names": "^1.2.3",
        "has-property-descriptors": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/set-proto": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/set-proto/-/set-proto-1.0.0.tgz",
      "integrity": "sha512-RJRdvCo6IAnPdsvP/7m6bsQqNnn1FCBX5ZNtFL98MmFF/4xAIJTIg1YbHW5DC2W5SKZanrC6i4HsJqlajw/dZw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "dunder-proto": "^1.0.1",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/sharp": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/sharp/-/sharp-0.34.5.tgz",
      "integrity": "sha512-Ou9I5Ft9WNcCbXrU9cMgPBcCK8LiwLqcbywW3t4oDV37n1pzpuNLsYiAV8eODnjbtQlSDwZ2cUEeQz4E54Hltg==",
      "hasInstallScript": true,
      "license": "Apache-2.0",
      "optional": true,
      "dependencies": {
        "@img/colour": "^1.0.0",
        "detect-libc": "^2.1.2",
        "semver": "^7.7.3"
      },
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-darwin-arm64": "0.34.5",
        "@img/sharp-darwin-x64": "0.34.5",
        "@img/sharp-libvips-darwin-arm64": "1.2.4",
        "@img/sharp-libvips-darwin-x64": "1.2.4",
        "@img/sharp-libvips-linux-arm": "1.2.4",
        "@img/sharp-libvips-linux-arm64": "1.2.4",
        "@img/sharp-libvips-linux-ppc64": "1.2.4",
        "@img/sharp-libvips-linux-riscv64": "1.2.4",
        "@img/sharp-libvips-linux-s390x": "1.2.4",
        "@img/sharp-libvips-linux-x64": "1.2.4",
        "@img/sharp-libvips-linuxmusl-arm64": "1.2.4",
        "@img/sharp-libvips-linuxmusl-x64": "1.2.4",
        "@img/sharp-linux-arm": "0.34.5",
        "@img/sharp-linux-arm64": "0.34.5",
        "@img/sharp-linux-ppc64": "0.34.5",
        "@img/sharp-linux-riscv64": "0.34.5",
        "@img/sharp-linux-s390x": "0.34.5",
        "@img/sharp-linux-x64": "0.34.5",
        "@img/sharp-linuxmusl-arm64": "0.34.5",
        "@img/sharp-linuxmusl-x64": "0.34.5",
        "@img/sharp-wasm32": "0.34.5",
        "@img/sharp-win32-arm64": "0.34.5",
        "@img/sharp-win32-ia32": "0.34.5",
        "@img/sharp-win32-x64": "0.34.5"
      }
    },
    "node_modules/shebang-command": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/shebang-command/-/shebang-command-2.0.0.tgz",
      "integrity": "sha512-kHxr2zZpYtdmrN1qDjrrX/Z1rR1kG8Dx+gkpK1G4eXmvXswmcE1hTWBWYUzlraYw1/yZp6YuDY77YtvbN0dmDA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "shebang-regex": "^3.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/shebang-regex": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/shebang-regex/-/shebang-regex-3.0.0.tgz",
      "integrity": "sha512-7++dFhtcx3353uBaq8DDR4NuxBetBzC7ZQOhmTQInHEd6bSrXdiEyzCvG07Z44UYdLShWUyXt5M/yhz8ekcb1A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/side-channel": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/side-channel/-/side-channel-1.1.1.tgz",
      "integrity": "sha512-6x6dK6zJdpTzF4sQeNYxwtvBzf6Eg4GtlesS94HOvTudUeyK2WXAaIfmDgsyslYrRBeFIlsi54AYsFGUuhmvrQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "object-inspect": "^1.13.4",
        "side-channel-list": "^1.0.1",
        "side-channel-map": "^1.0.1",
        "side-channel-weakmap": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-list": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/side-channel-list/-/side-channel-list-1.0.1.tgz",
      "integrity": "sha512-mjn/0bi/oUURjc5Xl7IaWi/OJJJumuoJFQJfDDyO46+hBWsfaVM65TBHq2eoZBhzl9EchxOijpkbRC8SVBQU0w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "object-inspect": "^1.13.4"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-map": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/side-channel-map/-/side-channel-map-1.0.1.tgz",
      "integrity": "sha512-VCjCNfgMsby3tTdo02nbjtM/ewra6jPHmpThenkTYh8pG9ucZ/1P8So4u4FGBek/BjpOVsDCMoLA/iuBKIFXRA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.5",
        "object-inspect": "^1.13.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-weakmap": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/side-channel-weakmap/-/side-channel-weakmap-1.0.2.tgz",
      "integrity": "sha512-WPS/HvHQTYnHisLo9McqBHOJk2FkHO/tlpvldyrnem4aeQp4hai3gythswg6p01oSoTl58rcpiFAjF2br2Ak2A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.5",
        "object-inspect": "^1.13.3",
        "side-channel-map": "^1.0.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/source-map-js": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/source-map-js/-/source-map-js-1.2.1.tgz",
      "integrity": "sha512-UXWMKhLOwVKb728IUtQPXxfYU+usdybtUrK/8uGE8CQMvrhOpwvzDBwj0QhSL7MQc7vIsISBG8VQ8+IDQxpfQA==",
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/stable-hash": {
      "version": "0.0.5",
      "resolved": "https://registry.npmjs.org/stable-hash/-/stable-hash-0.0.5.tgz",
      "integrity": "sha512-+L3ccpzibovGXFK+Ap/f8LOS0ahMrHTf3xu7mMLSpEGU0EO9ucaysSylKo9eRDFNhWve/y275iPmIZ4z39a9iA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/stop-iteration-iterator": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/stop-iteration-iterator/-/stop-iteration-iterator-1.1.0.tgz",
      "integrity": "sha512-eLoXW/DHyl62zxY4SCaIgnRhuMr6ri4juEYARS8E6sCEqzKpOiE521Ucofdx+KnDZl5xmvGYaaKCk5FEOxJCoQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "internal-slot": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/string.prototype.includes": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/string.prototype.includes/-/string.prototype.includes-2.0.1.tgz",
      "integrity": "sha512-o7+c9bW6zpAdJHTtujeePODAhkuicdAryFsfVKwA+wGw89wJ4GTY484WTucM9hLtDEOpOvI+aHnzqnC5lHp4Rg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.7",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.3"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/string.prototype.matchall": {
      "version": "4.0.12",
      "resolved": "https://registry.npmjs.org/string.prototype.matchall/-/string.prototype.matchall-4.0.12.tgz",
      "integrity": "sha512-6CC9uyBL+/48dYizRf7H7VAYCMCNTBeM78x/VTUe9bFEaxBepPJDa1Ow99LqI/1yF7kuy7Q3cQsYMrcjGUcskA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "call-bound": "^1.0.3",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.6",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.0.0",
        "get-intrinsic": "^1.2.6",
        "gopd": "^1.2.0",
        "has-symbols": "^1.1.0",
        "internal-slot": "^1.1.0",
        "regexp.prototype.flags": "^1.5.3",
        "set-function-name": "^2.0.2",
        "side-channel": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/string.prototype.repeat": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/string.prototype.repeat/-/string.prototype.repeat-1.0.0.tgz",
      "integrity": "sha512-0u/TldDbKD8bFCQ/4f5+mNRrXwZ8hg2w7ZR8wa16e8z9XpePWl3eGEcUD0OXpEH/VJH/2G3gjUtR3ZOiBe2S/w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "define-properties": "^1.1.3",
        "es-abstract": "^1.17.5"
      }
    },
    "node_modules/string.prototype.trim": {
      "version": "1.2.11",
      "resolved": "https://registry.npmjs.org/string.prototype.trim/-/string.prototype.trim-1.2.11.tgz",
      "integrity": "sha512-PwvK7BU+CMTJGYQCTZb5RWXIML92lftJLhQz1tBzgKiqGxJaMlBAa48POXaNAC2s4y8jr3EFqrkF9+44neS46w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.9",
        "call-bound": "^1.0.4",
        "define-data-property": "^1.1.4",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.24.2",
        "es-object-atoms": "^1.1.2",
        "has-property-descriptors": "^1.0.2",
        "safe-regex-test": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/string.prototype.trimend": {
      "version": "1.0.10",
      "resolved": "https://registry.npmjs.org/string.prototype.trimend/-/string.prototype.trimend-1.0.10.tgz",
      "integrity": "sha512-2+3aDAOmPTmuFwjDnmJG2ctEkQKVki7vOSqaxkv42Mowj1V6PnvuwFCRrR5lChUux1TBskPjfkeTOhqczDMxTw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.9",
        "call-bound": "^1.0.4",
        "define-properties": "^1.2.1",
        "es-object-atoms": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/string.prototype.trimstart": {
      "version": "1.0.8",
      "resolved": "https://registry.npmjs.org/string.prototype.trimstart/-/string.prototype.trimstart-1.0.8.tgz",
      "integrity": "sha512-UXSH262CSZY1tfu3G3Secr6uGLCFVPMhIqHjlgCUtCCcgihYc/xKs9djMTMUOb2j1mVSeU8EU6NWc/iQKU6Gfg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.7",
        "define-properties": "^1.2.1",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/strip-bom": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/strip-bom/-/strip-bom-3.0.0.tgz",
      "integrity": "sha512-vavAMRXOgBVNF6nyEEmL3DBK19iRpDcoIwW+swQ+CbGiu7lju6t+JklA1MHweoWtadgt4ISVUsXLyDq34ddcwA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/strip-json-comments": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/strip-json-comments/-/strip-json-comments-3.1.1.tgz",
      "integrity": "sha512-6fPc+R4ihwqP6N/aIv2f1gMH8lOVtWQHoqC4yK6oSDVVocumAsfCqjkXnqiYMhmMwS/mEHLp7Vehlt3ql6lEig==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/styled-jsx": {
      "version": "5.1.6",
      "resolved": "https://registry.npmjs.org/styled-jsx/-/styled-jsx-5.1.6.tgz",
      "integrity": "sha512-qSVyDTeMotdvQYoHWLNGwRFJHC+i+ZvdBRYosOFgC+Wg1vx4frN2/RG/NA7SYqqvKNLf39P2LSRA2pu6n0XYZA==",
      "license": "MIT",
      "dependencies": {
        "client-only": "0.0.1"
      },
      "engines": {
        "node": ">= 12.0.0"
      },
      "peerDependencies": {
        "react": ">= 16.8.0 || 17.x.x || ^18.0.0-0 || ^19.0.0-0"
      },
      "peerDependenciesMeta": {
        "@babel/core": {
          "optional": true
        },
        "babel-plugin-macros": {
          "optional": true
        }
      }
    },
    "node_modules/sucrase": {
      "version": "3.35.1",
      "resolved": "https://registry.npmjs.org/sucrase/-/sucrase-3.35.1.tgz",
      "integrity": "sha512-DhuTmvZWux4H1UOnWMB3sk0sbaCVOoQZjv8u1rDoTV0HTdGem9hkAZtl4JZy8P2z4Bg0nT+YMeOFyVr4zcG5Tw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/gen-mapping": "^0.3.2",
        "commander": "^4.0.0",
        "lines-and-columns": "^1.1.6",
        "mz": "^2.7.0",
        "pirates": "^4.0.1",
        "tinyglobby": "^0.2.11",
        "ts-interface-checker": "^0.1.9"
      },
      "bin": {
        "sucrase": "bin/sucrase",
        "sucrase-node": "bin/sucrase-node"
      },
      "engines": {
        "node": ">=16 || 14 >=14.17"
      }
    },
    "node_modules/supports-color": {
      "version": "7.2.0",
      "resolved": "https://registry.npmjs.org/supports-color/-/supports-color-7.2.0.tgz",
      "integrity": "sha512-qpCAvRl9stuOHveKsn7HncJRvv501qIacKzQlO/+Lwxc9+0q2wLyv4Dfvt80/DPn2pqOBsJdDiogXGR9+OvwRw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "has-flag": "^4.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/supports-preserve-symlinks-flag": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/supports-preserve-symlinks-flag/-/supports-preserve-symlinks-flag-1.0.0.tgz",
      "integrity": "sha512-ot0WnXS9fgdkgIcePe6RHNk1WA8+muPa6cSjeR3V8K27q9BB1rTE3R1p7Hv0z1ZyAc8s6Vvv8DIyWf681MAt0w==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/tailwindcss": {
      "version": "3.4.19",
      "resolved": "https://registry.npmjs.org/tailwindcss/-/tailwindcss-3.4.19.tgz",
      "integrity": "sha512-3ofp+LL8E+pK/JuPLPggVAIaEuhvIz4qNcf3nA1Xn2o/7fb7s/TYpHhwGDv1ZU3PkBluUVaF8PyCHcm48cKLWQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@alloc/quick-lru": "^5.2.0",
        "arg": "^5.0.2",
        "chokidar": "^3.6.0",
        "didyoumean": "^1.2.2",
        "dlv": "^1.1.3",
        "fast-glob": "^3.3.2",
        "glob-parent": "^6.0.2",
        "is-glob": "^4.0.3",
        "jiti": "^1.21.7",
        "lilconfig": "^3.1.3",
        "micromatch": "^4.0.8",
        "normalize-path": "^3.0.0",
        "object-hash": "^3.0.0",
        "picocolors": "^1.1.1",
        "postcss": "^8.4.47",
        "postcss-import": "^15.1.0",
        "postcss-js": "^4.0.1",
        "postcss-load-config": "^4.0.2 || ^5.0 || ^6.0",
        "postcss-nested": "^6.2.0",
        "postcss-selector-parser": "^6.1.2",
        "resolve": "^1.22.8",
        "sucrase": "^3.35.0"
      },
      "bin": {
        "tailwind": "lib/cli.js",
        "tailwindcss": "lib/cli.js"
      },
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/tailwindcss/node_modules/fast-glob": {
      "version": "3.3.3",
      "resolved": "https://registry.npmjs.org/fast-glob/-/fast-glob-3.3.3.tgz",
      "integrity": "sha512-7MptL8U0cqcFdzIzwOTHoilX9x5BrNqye7Z/LuC7kCMRio1EMSyqRK3BEAUD7sXRq4iT4AzTVuZdhgQ2TCvYLg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@nodelib/fs.stat": "^2.0.2",
        "@nodelib/fs.walk": "^1.2.3",
        "glob-parent": "^5.1.2",
        "merge2": "^1.3.0",
        "micromatch": "^4.0.8"
      },
      "engines": {
        "node": ">=8.6.0"
      }
    },
    "node_modules/tailwindcss/node_modules/fast-glob/node_modules/glob-parent": {
      "version": "5.1.2",
      "resolved": "https://registry.npmjs.org/glob-parent/-/glob-parent-5.1.2.tgz",
      "integrity": "sha512-AOIgSQCepiJYwP3ARnGx+5VnTu2HBYdzbGP45eLw1vr3zB3vZLeyed1sC9hnbcOc9/SrMyM5RPQrkGz4aS9Zow==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "is-glob": "^4.0.1"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/tailwindcss/node_modules/resolve": {
      "version": "1.22.12",
      "resolved": "https://registry.npmjs.org/resolve/-/resolve-1.22.12.tgz",
      "integrity": "sha512-TyeJ1zif53BPfHootBGwPRYT1RUt6oGWsaQr8UyZW/eAm9bKoijtvruSDEmZHm92CwS9nj7/fWttqPCgzep8CA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "is-core-module": "^2.16.1",
        "path-parse": "^1.0.7",
        "supports-preserve-symlinks-flag": "^1.0.0"
      },
      "bin": {
        "resolve": "bin/resolve"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/thenify": {
      "version": "3.3.1",
      "resolved": "https://registry.npmjs.org/thenify/-/thenify-3.3.1.tgz",
      "integrity": "sha512-RVZSIV5IG10Hk3enotrhvz0T9em6cyHBLkH/YAZuKqd8hRkKhSfCGIcP2KUY0EPxndzANBmNllzWPwak+bheSw==",
      "dev": true,
      "dependencies": {
        "any-promise": "^1.0.0"
      }
    },
    "node_modules/thenify-all": {
      "version": "1.6.0",
      "resolved": "https://registry.npmjs.org/thenify-all/-/thenify-all-1.6.0.tgz",
      "integrity": "sha512-RNxQH/qI8/t3thXJDwcstUO4zeqo64+Uy/+sNVRBx4Xn2OX+OZ9oP+iJnNFqplFra2ZUVeKCSa2oVWi3T4uVmA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "thenify": ">= 3.1.0 < 4"
      },
      "engines": {
        "node": ">=0.8"
      }
    },
    "node_modules/tiny-invariant": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/tiny-invariant/-/tiny-invariant-1.3.3.tgz",
      "integrity": "sha512-+FbBPE1o9QAYvviau/qC5SE3caw21q3xkvWKBtja5vgqOWIHHJ3ioaq1VPfn/Szqctz2bU/oYeKd9/z5BL+PVg==",
      "license": "MIT"
    },
    "node_modules/tinyglobby": {
      "version": "0.2.17",
      "resolved": "https://registry.npmjs.org/tinyglobby/-/tinyglobby-0.2.17.tgz",
      "integrity": "sha512-wXR/dYpcqKmfWpEdZjiKJOwCNFndD0DMnrW/cYjVGttEkBfVgcLFHoNrlj47mjOVic9yyNu65alsgF4NQyTa2g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fdir": "^6.5.0",
        "picomatch": "^4.0.4"
      },
      "engines": {
        "node": ">=12.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/SuperchupuDev"
      }
    },
    "node_modules/tinyglobby/node_modules/fdir": {
      "version": "6.5.0",
      "resolved": "https://registry.npmjs.org/fdir/-/fdir-6.5.0.tgz",
      "integrity": "sha512-tIbYtZbucOs0BRGqPJkshJUYdL+SDH7dVM8gjy+ERp3WAUjLEFJE+02kanyHtwjWOnwrKYBiwAmM0p4kLJAnXg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12.0.0"
      },
      "peerDependencies": {
        "picomatch": "^3 || ^4"
      },
      "peerDependenciesMeta": {
        "picomatch": {
          "optional": true
        }
      }
    },
    "node_modules/tinyglobby/node_modules/picomatch": {
      "version": "4.0.4",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-4.0.4.tgz",
      "integrity": "sha512-QP88BAKvMam/3NxH6vj2o21R6MjxZUAd6nlwAS/pnGvN9IVLocLHxGYIzFhg6fUQ+5th6P4dv4eW9jX3DSIj7A==",
      "dev": true,
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/to-regex-range": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/to-regex-range/-/to-regex-range-5.0.1.tgz",
      "integrity": "sha512-65P7iz6X5yEr1cwcgvQxbbIw7Uk3gOy5dIdtZ4rDveLqhrdJP+Li/Hx6tyK0NEb+2GCyneCMJiGqrADCSNk8sQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-number": "^7.0.0"
      },
      "engines": {
        "node": ">=8.0"
      }
    },
    "node_modules/ts-api-utils": {
      "version": "2.5.0",
      "resolved": "https://registry.npmjs.org/ts-api-utils/-/ts-api-utils-2.5.0.tgz",
      "integrity": "sha512-OJ/ibxhPlqrMM0UiNHJ/0CKQkoKF243/AEmplt3qpRgkW8VG7IfOS41h7V8TjITqdByHzrjcS/2si+y4lIh8NA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18.12"
      },
      "peerDependencies": {
        "typescript": ">=4.8.4"
      }
    },
    "node_modules/ts-interface-checker": {
      "version": "0.1.13",
      "resolved": "https://registry.npmjs.org/ts-interface-checker/-/ts-interface-checker-0.1.13.tgz",
      "integrity": "sha512-Y/arvbn+rrz3JCKl9C4kVNfTfSm2/mEp5FSz5EsZSANGPSlQrpRI5M4PKF+mJnE52jOO90PnPSc3Ur3bTQw0gA==",
      "dev": true,
      "license": "Apache-2.0"
    },
    "node_modules/tsconfig-paths": {
      "version": "3.15.0",
      "resolved": "https://registry.npmjs.org/tsconfig-paths/-/tsconfig-paths-3.15.0.tgz",
      "integrity": "sha512-2Ac2RgzDe/cn48GvOe3M+o82pEFewD3UPbyoUHHdKasHwJKjds4fLXWf/Ux5kATBKN20oaFGu+jbElp1pos0mg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/json5": "^0.0.29",
        "json5": "^1.0.2",
        "minimist": "^1.2.6",
        "strip-bom": "^3.0.0"
      }
    },
    "node_modules/tslib": {
      "version": "2.8.1",
      "resolved": "https://registry.npmjs.org/tslib/-/tslib-2.8.1.tgz",
      "integrity": "sha512-oJFu94HQb+KVduSUQL7wnpmqnfmLsOA/nAh6b6EH0wCEoK0/mPeXU6c3wKDV83MkOuHPRHtSXKKU99IBazS/2w==",
      "license": "0BSD"
    },
    "node_modules/type-check": {
      "version": "0.4.0",
      "resolved": "https://registry.npmjs.org/type-check/-/type-check-0.4.0.tgz",
      "integrity": "sha512-XleUoc9uwGXqjWwXaUTZAmzMcFZ5858QA2vvx1Ur5xIcixXIP+8LnFDgRplU30us6teqdlskFfu+ae4K79Ooew==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "prelude-ls": "^1.2.1"
      },
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/typed-array-buffer": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/typed-array-buffer/-/typed-array-buffer-1.0.3.tgz",
      "integrity": "sha512-nAYYwfY3qnzX30IkA6AQZjVbtK6duGontcQm1WSG1MD94YLqK0515GNApXkoxKOWMusVssAHWLh9SeaoefYFGw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "es-errors": "^1.3.0",
        "is-typed-array": "^1.1.14"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/typed-array-byte-length": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/typed-array-byte-length/-/typed-array-byte-length-1.0.3.tgz",
      "integrity": "sha512-BaXgOuIxz8n8pIq3e7Atg/7s+DpiYrxn4vdot3w9KbnBhcRQq6o3xemQdIfynqSeXeDrF32x+WvfzmOjPiY9lg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "for-each": "^0.3.3",
        "gopd": "^1.2.0",
        "has-proto": "^1.2.0",
        "is-typed-array": "^1.1.14"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/typed-array-byte-offset": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/typed-array-byte-offset/-/typed-array-byte-offset-1.0.4.tgz",
      "integrity": "sha512-bTlAFB/FBYMcuX81gbL4OcpH5PmlFHqlCCpAl8AlEzMz5k53oNDvN8p1PNOWLEmI2x4orp3raOFB51tv9X+MFQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "available-typed-arrays": "^1.0.7",
        "call-bind": "^1.0.8",
        "for-each": "^0.3.3",
        "gopd": "^1.2.0",
        "has-proto": "^1.2.0",
        "is-typed-array": "^1.1.15",
        "reflect.getprototypeof": "^1.0.9"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/typed-array-length": {
      "version": "1.0.8",
      "resolved": "https://registry.npmjs.org/typed-array-length/-/typed-array-length-1.0.8.tgz",
      "integrity": "sha512-phPGCwqr2+Qo0fwniCE8e4pKnGu/yFb5nD5Y8bf0EEeiI5GklnACYA9GFy/DrAeRrKHXvHn+1SUsOWgJp6RO+g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.9",
        "for-each": "^0.3.5",
        "gopd": "^1.2.0",
        "is-typed-array": "^1.1.15",
        "possible-typed-array-names": "^1.1.0",
        "reflect.getprototypeof": "^1.0.10"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/typescript": {
      "version": "5.9.3",
      "resolved": "https://registry.npmjs.org/typescript/-/typescript-5.9.3.tgz",
      "integrity": "sha512-jl1vZzPDinLr9eUt3J/t7V6FgNEw9QjvBPdysz9KfQDD41fQrC2Y4vKQdiaUpFT4bXlb1RHhLpp8wtm6M5TgSw==",
      "dev": true,
      "license": "Apache-2.0",
      "bin": {
        "tsc": "bin/tsc",
        "tsserver": "bin/tsserver"
      },
      "engines": {
        "node": ">=14.17"
      }
    },
    "node_modules/typescript-eslint": {
      "version": "8.61.0",
      "resolved": "https://registry.npmjs.org/typescript-eslint/-/typescript-eslint-8.61.0.tgz",
      "integrity": "sha512-8y31Rd0eGTrDKqhy6vT0HtzhN+YLjQizwX3aA3hPXP/ynSfnrBXcQY5IzsP9/DM7+klX4IUncZZjkchP0z+rUw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@typescript-eslint/eslint-plugin": "8.61.0",
        "@typescript-eslint/parser": "8.61.0",
        "@typescript-eslint/typescript-estree": "8.61.0",
        "@typescript-eslint/utils": "8.61.0"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      },
      "peerDependencies": {
        "eslint": "^8.57.0 || ^9.0.0 || ^10.0.0",
        "typescript": ">=4.8.4 <6.1.0"
      }
    },
    "node_modules/unbox-primitive": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/unbox-primitive/-/unbox-primitive-1.1.0.tgz",
      "integrity": "sha512-nWJ91DjeOkej/TA8pXQ3myruKpKEYgqvpw9lz4OPHj/NWFNluYrjbz9j01CJ8yKQd2g4jFoOkINCTW2I5LEEyw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "has-bigints": "^1.0.2",
        "has-symbols": "^1.1.0",
        "which-boxed-primitive": "^1.1.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/undici-types": {
      "version": "6.21.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.21.0.tgz",
      "integrity": "sha512-iwDZqg0QAGrg9Rav5H4n0M64c3mkR59cJ6wQp+7C4nI0gsmExaedaYLNO44eT4AtBBwjbTiGPMlt2Md0T9H9JQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/unrs-resolver": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/unrs-resolver/-/unrs-resolver-1.12.2.tgz",
      "integrity": "sha512-dmlRxBJJayXjqTwC+JtF1HhJmgf3ftQ3YejFcZrf4+KKtJv0qDsK1pjqaaVjG7wJ5NJ6UVP1OqRMQ71Z4C3rxQ==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "dependencies": {
        "napi-postinstall": "^0.3.4"
      },
      "funding": {
        "url": "https://opencollective.com/unrs-resolver"
      },
      "optionalDependencies": {
        "@unrs/resolver-binding-android-arm-eabi": "1.12.2",
        "@unrs/resolver-binding-android-arm64": "1.12.2",
        "@unrs/resolver-binding-darwin-arm64": "1.12.2",
        "@unrs/resolver-binding-darwin-x64": "1.12.2",
        "@unrs/resolver-binding-freebsd-x64": "1.12.2",
        "@unrs/resolver-binding-linux-arm-gnueabihf": "1.12.2",
        "@unrs/resolver-binding-linux-arm-musleabihf": "1.12.2",
        "@unrs/resolver-binding-linux-arm64-gnu": "1.12.2",
        "@unrs/resolver-binding-linux-arm64-musl": "1.12.2",
        "@unrs/resolver-binding-linux-loong64-gnu": "1.12.2",
        "@unrs/resolver-binding-linux-loong64-musl": "1.12.2",
        "@unrs/resolver-binding-linux-ppc64-gnu": "1.12.2",
        "@unrs/resolver-binding-linux-riscv64-gnu": "1.12.2",
        "@unrs/resolver-binding-linux-riscv64-musl": "1.12.2",
        "@unrs/resolver-binding-linux-s390x-gnu": "1.12.2",
        "@unrs/resolver-binding-linux-x64-gnu": "1.12.2",
        "@unrs/resolver-binding-linux-x64-musl": "1.12.2",
        "@unrs/resolver-binding-openharmony-arm64": "1.12.2",
        "@unrs/resolver-binding-wasm32-wasi": "1.12.2",
        "@unrs/resolver-binding-win32-arm64-msvc": "1.12.2",
        "@unrs/resolver-binding-win32-ia32-msvc": "1.12.2",
        "@unrs/resolver-binding-win32-x64-msvc": "1.12.2"
      }
    },
    "node_modules/update-browserslist-db": {
      "version": "1.2.3",
      "resolved": "https://registry.npmjs.org/update-browserslist-db/-/update-browserslist-db-1.2.3.tgz",
      "integrity": "sha512-Js0m9cx+qOgDxo0eMiFGEueWztz+d4+M3rGlmKPT+T4IS/jP4ylw3Nwpu6cpTTP8R1MAC1kF4VbdLt3ARf209w==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/browserslist"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "escalade": "^3.2.0",
        "picocolors": "^1.1.1"
      },
      "bin": {
        "update-browserslist-db": "cli.js"
      },
      "peerDependencies": {
        "browserslist": ">= 4.21.0"
      }
    },
    "node_modules/uri-js": {
      "version": "4.4.1",
      "resolved": "https://registry.npmjs.org/uri-js/-/uri-js-4.4.1.tgz",
      "integrity": "sha512-7rKUyy33Q1yc98pQ1DAmLtwX109F7TIfWlW1Ydo8Wl1ii1SeHieeh0HHfPeL2fMXK6z0s8ecKs9frCuLJvndBg==",
      "dev": true,
      "license": "BSD-2-Clause",
      "dependencies": {
        "punycode": "^2.1.0"
      }
    },
    "node_modules/use-sync-external-store": {
      "version": "1.6.0",
      "resolved": "https://registry.npmjs.org/use-sync-external-store/-/use-sync-external-store-1.6.0.tgz",
      "integrity": "sha512-Pp6GSwGP/NrPIrxVFAIkOQeyw8lFenOHijQWkUTrDvrF4ALqylP2C/KCkeS9dpUM3KvYRQhna5vt7IL95+ZQ9w==",
      "license": "MIT",
      "peerDependencies": {
        "react": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0"
      }
    },
    "node_modules/util-deprecate": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/util-deprecate/-/util-deprecate-1.0.2.tgz",
      "integrity": "sha512-EPD5q1uXyFxJpCrLnCc1nHnq3gOa6DZBocAIiI2TaSCA7VCJ1UJDMagCzIkXNsUYfD1daK//LTEQ8xiIbrHtcw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/victory-vendor": {
      "version": "37.3.6",
      "resolved": "https://registry.npmjs.org/victory-vendor/-/victory-vendor-37.3.6.tgz",
      "integrity": "sha512-SbPDPdDBYp+5MJHhBCAyI7wKM3d5ivekigc2Dk2s7pgbZ9wIgIBYGVw4zGHBml/qTFbexrofXW6Gu4noGxrOwQ==",
      "license": "MIT AND ISC",
      "dependencies": {
        "@types/d3-array": "^3.0.3",
        "@types/d3-ease": "^3.0.0",
        "@types/d3-interpolate": "^3.0.1",
        "@types/d3-scale": "^4.0.2",
        "@types/d3-shape": "^3.1.0",
        "@types/d3-time": "^3.0.0",
        "@types/d3-timer": "^3.0.0",
        "d3-array": "^3.1.6",
        "d3-ease": "^3.0.1",
        "d3-interpolate": "^3.0.1",
        "d3-scale": "^4.0.2",
        "d3-shape": "^3.1.0",
        "d3-time": "^3.0.0",
        "d3-timer": "^3.0.1"
      }
    },
    "node_modules/which": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/which/-/which-2.0.2.tgz",
      "integrity": "sha512-BLI3Tl1TW3Pvl70l3yq3Y64i+awpwXqsGBYWkkqMtnbXgrMD+yj7rhW0kuEDxzJaYXGjEW5ogapKNMEKNMjibA==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "isexe": "^2.0.0"
      },
      "bin": {
        "node-which": "bin/node-which"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/which-boxed-primitive": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/which-boxed-primitive/-/which-boxed-primitive-1.1.1.tgz",
      "integrity": "sha512-TbX3mj8n0odCBFVlY8AxkqcHASw3L60jIuF8jFP78az3C2YhmGvqbHBpAjTRH2/xqYunrJ9g1jSyjCjpoWzIAA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-bigint": "^1.1.0",
        "is-boolean-object": "^1.2.1",
        "is-number-object": "^1.1.1",
        "is-string": "^1.1.1",
        "is-symbol": "^1.1.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/which-builtin-type": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/which-builtin-type/-/which-builtin-type-1.2.1.tgz",
      "integrity": "sha512-6iBczoX+kDQ7a3+YJBnh3T+KZRxM/iYNPXicqk66/Qfm1b93iu+yOImkg0zHbj5LNOcNv1TEADiZ0xa34B4q6Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "function.prototype.name": "^1.1.6",
        "has-tostringtag": "^1.0.2",
        "is-async-function": "^2.0.0",
        "is-date-object": "^1.1.0",
        "is-finalizationregistry": "^1.1.0",
        "is-generator-function": "^1.0.10",
        "is-regex": "^1.2.1",
        "is-weakref": "^1.0.2",
        "isarray": "^2.0.5",
        "which-boxed-primitive": "^1.1.0",
        "which-collection": "^1.0.2",
        "which-typed-array": "^1.1.16"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/which-collection": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/which-collection/-/which-collection-1.0.2.tgz",
      "integrity": "sha512-K4jVyjnBdgvc86Y6BkaLZEN933SwYOuBFkdmBu9ZfkcAbdVbpITnDmjvZ/aQjRXQrv5EPkTnD1s39GiiqbngCw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-map": "^2.0.3",
        "is-set": "^2.0.3",
        "is-weakmap": "^2.0.2",
        "is-weakset": "^2.0.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/which-typed-array": {
      "version": "1.1.22",
      "resolved": "https://registry.npmjs.org/which-typed-array/-/which-typed-array-1.1.22.tgz",
      "integrity": "sha512-fvO4ExWMFsqyhG3AiPAObMuY1lxaqgYcxbc49CNdWDDECOJNgQyvsOWVwbZc+qf3rzRtxojBK+CMEv0Ld5CYpw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "available-typed-arrays": "^1.0.7",
        "call-bind": "^1.0.9",
        "call-bound": "^1.0.4",
        "for-each": "^0.3.5",
        "get-proto": "^1.0.1",
        "gopd": "^1.2.0",
        "has-tostringtag": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/word-wrap": {
      "version": "1.2.5",
      "resolved": "https://registry.npmjs.org/word-wrap/-/word-wrap-1.2.5.tgz",
      "integrity": "sha512-BN22B5eaMMI9UMtjrGd5g5eCYPpCPDUy0FJXbYsaT5zYxjFOckS53SQDE3pWkVoWpHXVb3BrYcEN4Twa55B5cA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/yallist": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/yallist/-/yallist-3.1.1.tgz",
      "integrity": "sha512-a4UGQaWPH59mOXUYnAG2ewncQS4i4F43Tv3JoAM+s2VDAmS9NsK8GpDMLrCHPksFT7h3K6TOoUNn2pb7RoXx4g==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/yocto-queue": {
      "version": "0.1.0",
      "resolved": "https://registry.npmjs.org/yocto-queue/-/yocto-queue-0.1.0.tgz",
      "integrity": "sha512-rVksvsnNCdJ/ohGc6xgPwyN8eheCxsiLM8mxuE/t/mOVqJewPuO1miLpTHQiRgTKCLexL4MeAFVagts7HmNZ2Q==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/zod": {
      "version": "4.4.3",
      "resolved": "https://registry.npmjs.org/zod/-/zod-4.4.3.tgz",
      "integrity": "sha512-ytENFjIJFl2UwYglde2jchW2Hwm4GJFLDiSXWdTrJQBIN9Fcyp7n4DhxJEiWNAJMV1/BqWfW/kkg71UDcHJyTQ==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/colinhacks"
      }
    },
    "node_modules/zod-validation-error": {
      "version": "4.0.2",
      "resolved": "https://registry.npmjs.org/zod-validation-error/-/zod-validation-error-4.0.2.tgz",
      "integrity": "sha512-Q6/nZLe6jxuU80qb/4uJ4t5v2VEZ44lzQjPDhYJNztRQ4wyWc6VF3D3Kb/fAuPetZQnhS3hnajCf9CsWesghLQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18.0.0"
      },
      "peerDependencies": {
        "zod": "^3.25.0 || ^4.0.0"
      }
    }
  }
}

```


---

## `package.json`

```json
{
  "name": "parkbuddy-secure",
  "version": "0.10.0",
  "private": true,
  "description": "ParkBuddy - secure responsive park golf club management web app",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "quality": "npm run verify",
    "security:smoke": "npm run security:scan",
    "security:scan": "node scripts/security-smoke-test.mjs",
    "verify": "npm run security:scan && npm run lint && npm run typecheck",
    "audit:prod": "npm audit --omit=dev --audit-level=high",
    "test": "npm run verify"
  },
  "dependencies": {
    "@supabase/ssr": "^0.12.0",
    "@supabase/supabase-js": "^2.108.1",
    "clsx": "^2.1.1",
    "lucide-react": "^1.17.0",
    "next": "^16.2.9",
    "react": "^19.2.7",
    "react-dom": "^19.2.7",
    "recharts": "^3.8.1",
    "zod": "^4.4.3"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3.3.3",
    "@types/node": "^20.17.10",
    "@types/react": "^19.2.7",
    "@types/react-dom": "^19.2.3",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.39.1",
    "eslint-config-next": "^16.2.9",
    "postcss": "^8.5.10",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.9.3"
  },
  "engines": {
    "node": ">=20.11.0"
  },
  "overrides": {
    "postcss": "^8.5.10"
  },
  "allowScripts": {
    "sharp@0.34.5": true,
    "unrs-resolver@1.12.2": true
  }
}

```


---

## `postcss.config.mjs`

```js
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;

```


---

## `scripts/security-smoke-test.mjs`

```js
﻿import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const forbiddenPatterns = [
  { pattern: /SERVICE_ROLE/i, reason: 'service_role key reference must not appear in app source' },
  { pattern: /dangerouslySetInnerHTML/, reason: 'dangerouslySetInnerHTML is not allowed without a sanitizer review' },
  { pattern: /NEXT_PUBLIC_SUPABASE_SERVICE/i, reason: 'public service key environment variable is forbidden' },
  { pattern: /supabase\.co\/[A-Za-z0-9_-]{20,}/, reason: 'possible hard-coded Supabase project URL' },
];

const includeExt = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.sql', '.json']);
const ignoreDirs = new Set(['node_modules', '.next', '.git']);
const ignoreFiles = new Set([
  // This file intentionally contains the forbidden pattern definitions.
  'scripts/security-smoke-test.mjs',
]);
const failures = [];

function toPortablePath(filePath) {
  return filePath.split(path.sep).join('/');
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoreDirs.has(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (!includeExt.has(path.extname(entry.name))) continue;

    const relativePath = path.relative(root, fullPath);
    const portablePath = toPortablePath(relativePath);

    if (ignoreFiles.has(portablePath)) continue;

    const text = fs.readFileSync(fullPath, 'utf8');

    for (const item of forbiddenPatterns) {
      if (item.pattern.test(text)) {
        failures.push(`${portablePath}: ${item.reason}`);
      }
    }
  }
}

walk(root);

const migrationPath = path.join(root, 'supabase/migrations/0001_secure_schema.sql');

if (!fs.existsSync(migrationPath)) {
  failures.push('migration file is missing: supabase/migrations/0001_secure_schema.sql');
} else {
  const migration = fs.readFileSync(migrationPath, 'utf8');
  const requiredSql = [
    'enable row level security',
    'security_invoker = true',
    'create policy "members can read same club members"',
    'create policy "club members can read post images"',
  ];

  for (const token of requiredSql) {
    if (!migration.includes(token)) {
      failures.push(`migration missing required security token: ${token}`);
    }
  }
}

if (!fs.existsSync(path.join(root, '.env.example'))) {
  failures.push('.env.example is missing');
}

if (!fs.existsSync(path.join(root, '.github/workflows/ci.yml'))) {
  failures.push('GitHub Actions workflow is missing');
}

if (failures.length > 0) {
  console.error('Security smoke test failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Security smoke test passed.');

```


---

## `src/app/(app)/admin/events/new/page.tsx`

```ts
import { SubmitButton } from '@/components/SubmitButton';
import { TopBar } from '@/components/TopBar';
import { createEvent } from '@/server/actions/events';
import { requireAdmin } from '@/server/auth';

export default async function NewEventPage() {
  await requireAdmin();

  return (
    <main className="space-y-5">
      <TopBar title="일정 등록" />
      <form action={createEvent} className="space-y-4 rounded-3xl bg-white p-5 shadow-sm">
        <label className="block text-sm font-semibold text-slate-700">제목<input name="title" required maxLength={80} className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-emerald-500" /></label>
        <label className="block text-sm font-semibold text-slate-700">유형<select name="event_type" defaultValue="regular" className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-emerald-500"><option value="regular">정기 라운딩</option><option value="tournament">대회</option><option value="casual">번개</option></select></label>
        <label className="block text-sm font-semibold text-slate-700">일시<input name="starts_at" type="datetime-local" required className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-emerald-500" /></label>
        <label className="block text-sm font-semibold text-slate-700">코스명<input name="course_name" required maxLength={80} className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-emerald-500" /></label>
        <label className="block text-sm font-semibold text-slate-700">홀 수<select name="holes" defaultValue="18" className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-emerald-500"><option value="9">9홀</option><option value="18">18홀</option><option value="27">27홀</option><option value="36">36홀</option></select></label>
        <label className="block text-sm font-semibold text-slate-700">최대 인원<input name="max_participants" type="number" min="1" max="200" className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-emerald-500" /></label>
        <label className="block text-sm font-semibold text-slate-700">메모<textarea name="memo" maxLength={1000} rows={5} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" /></label>
        <SubmitButton label="일정 등록" />
      </form>
    </main>
  );
}

```


---

## `src/app/(app)/admin/logs/page.tsx`

```ts
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/require-member';

type AdminLogRow = {
  id?: string;
  action?: string | null;
  target_type?: string | null;
  target_id?: string | null;
  metadata?: Record<string, unknown> | null;
  details?: Record<string, unknown> | null;
  created_at?: string | null;
  actor_member_id?: string | null;
  admin_member_id?: string | null;
};

function formatDateTime(value?: string | null) {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function getActionLabel(action?: string | null) {
  switch (action) {
    case 'member.create':
      return '회원 등록';
    case 'member.update':
      return '회원 정보 수정';
    case 'member.deactivate':
      return '회원 비활성화';
    case 'member.restore':
      return '회원 복구';
    case 'member.claim_code.reissue':
      return '회원 연결 코드 재발급';
    case 'round.create':
      return '라운드 생성';
    case 'round.update':
      return '라운드 정보 수정';
    case 'round.status.update':
      return '라운드 상태 변경';
    case 'round.duplicate':
      return '라운드 복제';
    case 'round.participants.update':
      return '라운드 참가자 변경';
    case 'round.pairings.update':
      return '라운드 조 편성 저장';
    case 'round.scores.update':
      return '라운드 스코어 저장';
    case 'round_soft_delete':
    case 'round.soft_delete':
    case 'round.delete':
      return '라운드 삭제 보관';
    case 'round_restore':
    case 'round.restore':
      return '라운드 복구';
    default:
      return action ?? '알 수 없는 작업';
  }
}

function getTargetLabel(targetType?: string | null) {
  switch (targetType) {
    case 'member':
      return '회원';
    case 'round':
      return '라운드';
    case 'round_participant':
      return '라운드 참가자';
    case 'round_pairing':
      return '라운드 조 편성';
    case 'round_score':
      return '라운드 스코어';
    default:
      return targetType ?? '대상 없음';
  }
}

function getValueLabel(key: string, value: unknown) {
  if (value === null || value === undefined || value === '') {
    return '없음';
  }

  if (typeof value === 'boolean') {
    return value ? '예' : '아니오';
  }

  if (key === 'status' || key === 'new_status' || key === 'old_status') {
    switch (value) {
      case 'scheduled':
        return '예정';
      case 'completed':
        return '완료';
      case 'cancelled':
        return '취소';
      default:
        return String(value);
    }
  }

  if (key === 'game_type' || key === 'play_mode') {
    switch (value) {
      case 'individual':
        return '개인전';
      case 'foursome':
        return '포섬';
      case 'fourball':
        return '포볼';
      case 'scramble':
        return '스크램블';
      case 'team_match':
        return '청백전';
      default:
        return String(value);
    }
  }

  if (key === 'scoring_type') {
    switch (value) {
      case 'stroke':
        return '스트로크';
      case 'new_peoria':
        return '신페리오';
      case 'match':
      case 'match_play':
        return '매치 플레이';
      case 'stableford':
        return '스테이블포드';
      default:
        return String(value);
    }
  }


  if (key === 'deleted_at' || key === 'restored_at' || key === 'created_at' || key === 'updated_at') {
    return formatDateTime(String(value));
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

function getKeyLabel(key: string) {
  switch (key) {
    case 'member_id':
      return '회원 ID';
    case 'round_id':
      return '라운드 ID';
    case 'round_title':
      return '라운드명';
    case 'source_round_id':
      return '원본 라운드 ID';
    case 'new_round_id':
      return '새 라운드 ID';
    case 'name':
      return '이름';
    case 'title':
      return '라운드명';
    case 'course_name':
      return '코스명';
    case 'play_date':
      return '라운드 날짜';
    case 'memo':
      return '메모';
    case 'status':
      return '상태';
    case 'old_status':
      return '이전 상태';
    case 'new_status':
      return '변경 상태';
    case 'deleted_at':
      return '삭제 보관 시각';
    case 'restored_at':
      return '복구 시각';
    case 'deleted_by_member_id':
      return '삭제 처리자 ID';
    case 'game_type':
    case 'play_mode':
      return '경기 형태';
    case 'scoring_type':
      return '점수 계산 방식';
    case 'participant_count':
      return '참가자 수';
    case 'score_count':
      return '스코어 수';
    default:
      return key;
  }
}

function getMetadata(log: AdminLogRow) {
  return log.metadata ?? log.details ?? {};
}

function formatMetadata(log: AdminLogRow) {
  const metadata = getMetadata(log);
  const entries = Object.entries(metadata).filter(
    ([, value]) => value !== undefined && value !== null && value !== '',
  );

  if (!entries.length) {
    return ['세부 내용 없음'];
  }

  return entries.map(([key, value]) => `${getKeyLabel(key)}: ${getValueLabel(key, value)}`);
}

export default async function AdminLogsPage() {
  const { supabase, member } = await requireAdmin();

  const { data: logs, error } = await supabase
    .from('admin_action_logs')
    .select('*')
    .eq('club_id', member.club_id)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    throw new Error(error.message);
  }

  const typedLogs = (logs ?? []) as AdminLogRow[];

  return (
    <main className="mx-auto max-w-5xl space-y-5 px-4 py-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-600">
            관리자 작업 로그
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            작업 이력
          </h1>
        </div>

        <Link
          href="/admin"
          className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
        >
          관리자 홈
        </Link>
      </header>

      <section className="rounded-3xl bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-bold text-slate-900">최근 작업</h2>
        </div>

        <div className="divide-y divide-slate-100">
          {typedLogs.length ? (
            typedLogs.map((log, index) => (
              <article key={log.id ?? index} className="space-y-3 px-5 py-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-bold text-slate-900">
                      {getActionLabel(log.action)}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {getTargetLabel(log.target_type)}
                      {log.target_id ? ` · ${log.target_id}` : ''}
                    </p>
                  </div>

                  <time className="text-sm text-slate-500">
                    {formatDateTime(log.created_at)}
                  </time>
                </div>

                <ul className="space-y-1 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                  {formatMetadata(log).map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </article>
            ))
          ) : (
            <div className="px-5 py-12 text-center">
              <p className="text-sm font-semibold text-slate-700">
                아직 기록된 관리자 작업이 없습니다.
              </p>
              <p className="mt-1 text-sm text-slate-500">
                회원 관리나 라운드 관리 작업을 진행하면 이곳에 기록됩니다.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

```


---

## `src/app/(app)/admin/members/[id]/edit/page.tsx`

```ts
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/require-member';
import { formatKoreanPhoneNumber } from '@/lib/korean-search';
import { updateMemberAction } from '../../actions';

type EditMemberPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

function getErrorMessage(error?: string) {
  switch (error) {
    case 'invalid_name':
      return '회원 이름을 2자 이상 입력해 주세요.';
    case 'invalid_phone':
      return '연락처를 정확히 입력해 주세요.';
    case 'invalid_role':
      return '회원 역할이 올바르지 않습니다.';
    case 'invalid_handicap':
      return '핸디캡 값이 올바르지 않습니다.';
    case 'duplicate_phone':
      return '같은 연락처의 활성 회원이 이미 존재합니다.';
    case 'admin_required':
      return '운영진만 회원을 수정할 수 있습니다.';
    case 'member_not_found':
      return '회원을 찾을 수 없습니다.';
    case 'cannot_demote_self':
      return '자기 자신의 운영진 권한은 해제할 수 없습니다.';
    case 'last_admin_required':
      return '동호회에는 최소 1명의 운영진이 필요합니다.';
    case 'rpc_missing':
      return 'Supabase 회원 수정 함수가 없습니다. 0007 SQL을 먼저 실행해 주세요.';
    case 'permission_denied':
      return '회원 수정 함수 실행 권한이 없습니다.';
    case 'unknown':
      return '알 수 없는 오류가 발생했습니다.';
    default:
      return null;
  }
}

export default async function EditMemberPage({
  params,
  searchParams,
}: EditMemberPageProps) {
  const routeParams = await params;
  const queryParams = await searchParams;
  const { supabase, member: currentMember } = await requireAdmin();

  const { data: member, error } = await supabase
    .from('members')
    .select(
      `
      id,
      club_id,
      name,
      phone,
      handicap,
      role,
      status,
      user_id,
      joined_on
    `,
    )
    .eq('id', routeParams.id)
    .eq('club_id', currentMember.club_id)
    .eq('status', 'active')
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!member) {
    notFound();
  }

  const errorMessage = getErrorMessage(queryParams.error);

  return (
    <main className="mx-auto max-w-3xl space-y-4 px-3 py-4 pb-32 sm:px-4 lg:px-6">
      <header>
        <div>
          <p className="text-sm font-semibold text-emerald-600">운영진 관리</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">회원 수정</h1>
          <p className="mt-2 text-sm leading-5 text-slate-600">
            {member.name} 회원의 연락처, 핸디캡, 역할을 수정합니다.
          </p>
        </div>
      </header>

      {errorMessage && (
        <section className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
          {errorMessage}
        </section>
      )}

      <form action={updateMemberAction} className="space-y-4">
        <input type="hidden" name="memberId" value={member.id} />

        <section className="rounded-3xl bg-white p-4 shadow-sm lg:p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">이름</span>
              <input
                name="name"
                type="text"
                autoComplete="name"
                required
                minLength={2}
                defaultValue={member.name}
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">연락처</span>
              <input
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                defaultValue={formatKoreanPhoneNumber(member.phone)}
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">핸디캡</span>
              <input
                name="handicap"
                type="number"
                inputMode="decimal"
                step="0.1"
                defaultValue={member.handicap ?? 0}
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">역할</span>
              <select
                name="role"
                defaultValue={member.role}
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="member">회원</option>
                <option value="admin">운영진</option>
              </select>
            </label>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-4 text-xs leading-5 text-slate-500 shadow-sm lg:p-5">
          자기 자신의 운영진 권한 해제와 마지막 운영진 권한 해제는 보안상 차단됩니다.
        </section>

        <div className="sticky bottom-24 z-20 grid grid-cols-2 gap-2 rounded-3xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur lg:static lg:shadow-none">
          <button
            type="submit"
            className="h-12 rounded-2xl bg-emerald-600 px-4 font-bold text-white active:scale-[0.99]"
          >
            수정 저장
          </button>

          <Link
            href="/admin/members"
            className="flex h-12 items-center justify-center rounded-2xl bg-slate-100 px-4 font-bold text-slate-700"
          >
            취소
          </Link>
        </div>
      </form>
    </main>
  );
}

```


---

## `src/app/(app)/admin/members/actions.ts`

```ts
'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/require-member';

function getRpcErrorCode(message?: string) {
  if (!message) {
    return 'unknown';
  }

  if (message.includes('AUTH_REQUIRED')) {
    return 'auth_required';
  }

  if (message.includes('ADMIN_REQUIRED')) {
    return 'admin_required';
  }

  if (message.includes('INVALID_NAME')) {
    return 'invalid_name';
  }

  if (message.includes('INVALID_PHONE')) {
    return 'invalid_phone';
  }

  if (message.includes('INVALID_ROLE')) {
    return 'invalid_role';
  }

  if (message.includes('INVALID_HANDICAP')) {
    return 'invalid_handicap';
  }

  if (message.includes('DUPLICATE_PHONE')) {
    return 'duplicate_phone';
  }

  if (message.includes('MEMBER_NOT_FOUND')) {
    return 'member_not_found';
  }

  if (message.includes('MEMBER_ALREADY_LINKED')) {
    return 'member_already_linked';
  }

  if (message.includes('CANNOT_DEMOTE_SELF')) {
    return 'cannot_demote_self';
  }

  if (message.includes('CANNOT_DEACTIVATE_SELF')) {
    return 'cannot_deactivate_self';
  }

  if (message.includes('LAST_ADMIN_REQUIRED')) {
    return 'last_admin_required';
  }

  if (message.includes('Could not find the function')) {
    return 'rpc_missing';
  }

  if (message.includes('permission denied')) {
    return 'permission_denied';
  }

  return 'unknown';
}

function sanitizeRedirectValue(value: unknown) {
  return encodeURIComponent(String(value ?? '').slice(0, 120));
}

function getMemberFormValues(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const role = String(formData.get('role') ?? 'member');
  const handicapValue = String(formData.get('handicap') ?? '0').trim();
  const handicap = Number(handicapValue || 0);

  return {
    name,
    phone,
    role,
    handicap,
  };
}

function validateMemberForm({
  name,
  phone,
  role,
  handicap,
  redirectBasePath,
}: {
  name: string;
  phone: string;
  role: string;
  handicap: number;
  redirectBasePath: string;
}) {
  if (name.length < 2) {
    redirect(`${redirectBasePath}?error=invalid_name`);
  }

  if (phone.replace(/\D/g, '').length < 8) {
    redirect(`${redirectBasePath}?error=invalid_phone`);
  }

  if (!Number.isFinite(handicap)) {
    redirect(`${redirectBasePath}?error=invalid_handicap`);
  }

  if (!['member', 'admin'].includes(role)) {
    redirect(`${redirectBasePath}?error=invalid_role`);
  }
}

export async function createMemberAction(formData: FormData) {
  const { supabase } = await requireAdmin();

  const values = getMemberFormValues(formData);

  validateMemberForm({
    ...values,
    redirectBasePath: '/admin/members/new',
  });

  const { data, error } = await supabase.rpc('admin_create_member', {
    p_name: values.name,
    p_phone: values.phone,
    p_handicap: values.handicap,
    p_role: values.role,
  });

  if (error) {
    console.error('admin_create_member failed', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    redirect(`/admin/members/new?error=${getRpcErrorCode(error.message)}`);
  }

  const created = Array.isArray(data) ? data[0] : data;

  if (!created) {
    redirect('/admin/members/new?error=unknown');
  }

  revalidatePath('/members');
  revalidatePath('/admin/members');

  const params = new URLSearchParams({
    created: '1',
    name: String(created.member_name),
    phone: String(created.member_phone),
    code: String(created.claim_code),
    expires: String(created.claim_code_expires_at),
  });

  redirect(`/admin/members?${params.toString()}`);
}

export async function updateMemberAction(formData: FormData) {
  const { supabase } = await requireAdmin();

  const memberId = String(formData.get('memberId') ?? '').trim();

  if (!memberId) {
    redirect('/admin/members?error=member_not_found');
  }

  const editPath = `/admin/members/${memberId}/edit`;
  const values = getMemberFormValues(formData);

  validateMemberForm({
    ...values,
    redirectBasePath: editPath,
  });

  const { error } = await supabase.rpc('admin_update_member', {
    p_member_id: memberId,
    p_name: values.name,
    p_phone: values.phone,
    p_handicap: values.handicap,
    p_role: values.role,
  });

  if (error) {
    console.error('admin_update_member failed', {
      memberId,
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    redirect(`${editPath}?error=${getRpcErrorCode(error.message)}`);
  }

  revalidatePath('/members');
  revalidatePath('/admin/members');
  revalidatePath(editPath);

  redirect('/admin/members?updated=1');
}

export async function deactivateMemberAction(formData: FormData) {
  const { supabase } = await requireAdmin();

  const memberId = String(formData.get('memberId') ?? '').trim();

  if (!memberId) {
    redirect('/admin/members?error=member_not_found');
  }

  const { error } = await supabase.rpc('admin_deactivate_member', {
    p_member_id: memberId,
  });

  if (error) {
    console.error('admin_deactivate_member failed', {
      memberId,
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    redirect(`/admin/members?error=${getRpcErrorCode(error.message)}`);
  }

  revalidatePath('/members');
  revalidatePath('/admin/members');

  redirect('/admin/members?deactivated=1');
}

export async function restoreMemberAction(formData: FormData) {
  const { supabase } = await requireAdmin();

  const memberId = String(formData.get('memberId') ?? '').trim();

  if (!memberId) {
    redirect('/admin/members?status=inactive&error=member_not_found');
  }

  const { error } = await supabase.rpc('admin_restore_member', {
    p_member_id: memberId,
  });

  if (error) {
    console.error('admin_restore_member failed', {
      memberId,
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    redirect(
      `/admin/members?status=inactive&error=${getRpcErrorCode(error.message)}`,
    );
  }

  revalidatePath('/members');
  revalidatePath('/admin/members');

  redirect('/admin/members?status=inactive&restored=1');
}

export async function reissueClaimCodeAction(formData: FormData) {
  const { supabase } = await requireAdmin();

  const memberId = String(formData.get('memberId') ?? '').trim();

  if (!memberId) {
    redirect('/admin/members?error=member_not_found');
  }

  const { data, error } = await supabase.rpc('admin_reissue_member_claim_code', {
    p_member_id: memberId,
  });

  if (error) {
    console.error('admin_reissue_member_claim_code failed', {
      memberId,
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    redirect(`/admin/members?error=${getRpcErrorCode(error.message)}`);
  }

  const result = Array.isArray(data) ? data[0] : data;

  if (!result) {
    redirect('/admin/members?error=unknown');
  }

  revalidatePath('/members');
  revalidatePath('/admin/members');

  const params = new URLSearchParams({
    reissued: '1',
    name: sanitizeRedirectValue(result.member_name),
    phone: sanitizeRedirectValue(result.member_phone),
    code: sanitizeRedirectValue(result.claim_code),
    expires: sanitizeRedirectValue(result.claim_code_expires_at),
  });

  redirect(`/admin/members?${params.toString()}`);
}

```


---

## `src/app/(app)/admin/members/new/page.tsx`

```ts
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/require-member';
import { createMemberAction } from '../actions';

type NewMemberPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

function getErrorMessage(error?: string) {
  switch (error) {
    case 'invalid_name':
      return '회원 이름을 2자 이상 입력해 주세요.';
    case 'invalid_phone':
      return '연락처를 정확히 입력해 주세요.';
    case 'invalid_role':
      return '회원 역할이 올바르지 않습니다.';
    case 'invalid_handicap':
      return '핸디캡 값이 올바르지 않습니다.';
    case 'duplicate_phone':
      return '같은 연락처의 활성 회원이 이미 존재합니다.';
    case 'admin_required':
      return '운영진만 회원을 등록할 수 있습니다.';
    case 'rpc_missing':
      return 'Supabase 관리자 회원 등록 함수가 없습니다. 0006 SQL을 먼저 실행해 주세요.';
    case 'permission_denied':
      return '회원 등록 함수 실행 권한이 없습니다.';
    case 'unknown':
      return '알 수 없는 오류가 발생했습니다.';
    default:
      return null;
  }
}

export default async function NewMemberPage({
  searchParams,
}: NewMemberPageProps) {
  await requireAdmin();

  const params = await searchParams;
  const errorMessage = getErrorMessage(params.error);

  return (
    <main className="mx-auto max-w-3xl space-y-4 px-3 py-4 pb-32 sm:px-4 lg:px-6">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-emerald-600">운영진 관리</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">회원 등록</h1>
          <p className="mt-2 text-sm leading-5 text-slate-600">
            등록 완료 후 표시되는 연결 코드를 회원에게 전달합니다.
          </p>
        </div>

        <Link
          href="/admin/members"
          className="shrink-0 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700"
        >
          목록
        </Link>
      </header>

      {errorMessage && (
        <section className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
          {errorMessage}
        </section>
      )}

      <form action={createMemberAction} className="space-y-4">
        <section className="rounded-3xl bg-white p-4 shadow-sm lg:p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">이름</span>
              <input
                name="name"
                type="text"
                autoComplete="name"
                required
                minLength={2}
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="예: 홍길동"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">연락처</span>
              <input
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="예: 01022223333"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">핸디캡</span>
              <input
                name="handicap"
                type="number"
                inputMode="decimal"
                step="0.1"
                defaultValue="0"
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">역할</span>
              <select
                name="role"
                defaultValue="member"
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="member">회원</option>
                <option value="admin">운영진</option>
              </select>
            </label>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-4 text-xs leading-5 text-slate-500 shadow-sm lg:p-5">
          보안상 연결 코드는 평문 저장하지 않고 해시로 저장합니다. 등록 후 표시되는 코드는 회원에게 전달한 뒤 다시 확인할 수 없으며, 필요하면 회원 관리 화면에서 재발급하세요.
        </section>

        <div className="sticky bottom-24 z-20 rounded-3xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur lg:static lg:shadow-none">
          <button
            type="submit"
            className="h-12 w-full rounded-2xl bg-emerald-600 px-4 font-bold text-white active:scale-[0.99]"
          >
            회원 등록하고 연결 코드 발급
          </button>
        </div>
      </form>
    </main>
  );
}

```


---

## `src/app/(app)/admin/members/page.tsx`

```ts
import Link from 'next/link';
import { ConfirmSubmitButton } from '@/components/confirm-submit-button';
import { CopyButton } from '@/components/copy-button';
import { MemberFilterControls } from '@/components/admin/member-filter-controls';
import { requireAdmin } from '@/lib/auth/require-member';
import { formatKoreanPhoneNumber, normalizeDigits } from '@/lib/korean-search';
import {
  deactivateMemberAction,
  reissueClaimCodeAction,
  restoreMemberAction,
} from './actions';

type AdminMembersPageProps = {
  searchParams: Promise<{
    created?: string;
    reissued?: string;
    updated?: string;
    deactivated?: string;
    restored?: string;
    name?: string;
    phone?: string;
    code?: string;
    expires?: string;
    error?: string;
    status?: string;
  }>;
};

type MemberStatusFilter = 'active' | 'inactive';
type MemberViewFilter = 'all' | 'linked' | 'waiting' | 'needs-code';

type AdminMember = {
  id: string;
  name: string;
  phone: string | null;
  handicap: number | null;
  role: 'admin' | 'member';
  status: string;
  user_id: string | null;
  joined_on: string | null;
  claimed_at: string | null;
  claim_code_hash: string | null;
  claim_code_expires_at: string | null;
  created_at: string;
};

function getErrorMessage(error?: string) {
  switch (error) {
    case 'auth_required': return '로그인이 필요합니다.';
    case 'admin_required': return '운영진만 회원 관리에 접근할 수 있습니다.';
    case 'invalid_name': return '회원 이름을 2자 이상 입력해 주세요.';
    case 'invalid_phone': return '연락처를 정확히 입력해 주세요.';
    case 'invalid_role': return '회원 역할이 올바르지 않습니다.';
    case 'invalid_handicap': return '핸디캡 값이 올바르지 않습니다.';
    case 'duplicate_phone': return '같은 연락처의 활성 회원이 이미 존재합니다.';
    case 'member_not_found': return '회원을 찾을 수 없습니다.';
    case 'member_already_linked': return '이미 계정 연결이 완료된 회원은 연결 코드를 재발급할 수 없습니다.';
    case 'cannot_demote_self': return '자기 자신의 운영진 권한은 해제할 수 없습니다.';
    case 'cannot_deactivate_self': return '자기 자신은 비활성화할 수 없습니다.';
    case 'last_admin_required': return '동호회에는 최소 1명의 운영진이 필요합니다.';
    case 'rpc_missing': return 'Supabase 관리자 함수가 없습니다. 최신 SQL을 먼저 실행해 주세요.';
    case 'permission_denied': return '관리자 함수 실행 권한이 없습니다. Supabase 권한 설정을 확인해 주세요.';
    case 'unknown': return '알 수 없는 오류가 발생했습니다.';
    default: return null;
  }
}

function getStatusFilter(value?: string): MemberStatusFilter {
  return value === 'inactive' ? 'inactive' : 'active';
}

function formatDateTime(value?: string | null) {
  if (!value) {
    return '-';
  }

  return new Date(value).toLocaleString('ko-KR');
}

function getView(member: AdminMember): MemberViewFilter {
  if (member.user_id) {
    return 'linked';
  }

  if (member.claim_code_hash) {
    return 'waiting';
  }

  return 'needs-code';
}

function getCounts(members: AdminMember[], status: MemberStatusFilter) {
  const scoped = members.filter((member) => status === 'inactive' ? member.status === 'inactive' : member.status !== 'inactive');
  const linked = scoped.filter((member) => getView(member) === 'linked');
  const waiting = scoped.filter((member) => getView(member) === 'waiting');
  const needsCode = scoped.filter((member) => getView(member) === 'needs-code');

  return {
    all: scoped.length,
    linked: linked.length,
    waiting: waiting.length,
    'needs-code': needsCode.length,
  } satisfies Record<MemberViewFilter, number>;
}

export default async function AdminMembersPage({ searchParams }: AdminMembersPageProps) {
  const params = await searchParams;
  const initialStatus = getStatusFilter(params.status);
  const { supabase, member: currentMember } = await requireAdmin();

  const { data: members, error } = await supabase
    .from('members')
    .select('id, name, phone, handicap, role, status, user_id, joined_on, claimed_at, claim_code_hash, claim_code_expires_at, created_at')
    .eq('club_id', currentMember.club_id)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const allMembers = (members ?? []) as AdminMember[];
  const counts = {
    active: getCounts(allMembers, 'active'),
    inactive: getCounts(allMembers, 'inactive'),
  };

  const errorMessage = getErrorMessage(params.error);
  const claimCode = params.code ? decodeURIComponent(params.code) : undefined;
  const claimName = params.name ? decodeURIComponent(params.name) : undefined;
  const claimPhone = params.phone ? decodeURIComponent(params.phone) : undefined;
  const claimExpires = params.expires ? decodeURIComponent(params.expires) : undefined;

  return (
    <main className="mx-auto max-w-7xl space-y-4 px-4 py-6 pb-32">
      <header>
        <p className="text-sm font-semibold text-emerald-600">운영진 관리</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">회원 관리</h1>
      </header>

      {errorMessage ? <section className="rounded-3xl border border-red-200 bg-red-50 p-5 text-sm leading-6 text-red-700">{errorMessage}</section> : null}
      {params.updated ? <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-semibold text-emerald-700">회원 정보가 수정되었습니다.</section> : null}
      {params.deactivated ? <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-semibold text-emerald-700">회원이 비활성화되었습니다.</section> : null}
      {params.restored ? <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-semibold text-emerald-700">회원이 복구되었습니다.</section> : null}

      {claimCode ? (
        <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm font-semibold text-emerald-700">{params.created ? '회원이 등록되었습니다.' : '연결 코드가 재발급되었습니다.'}</p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">{claimName} 회원 연결 코드</h2>
          <div className="mt-4 rounded-2xl bg-white p-4">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-slate-500">이름</dt><dd className="font-semibold text-slate-900">{claimName}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">연락처</dt><dd className="font-semibold text-slate-900">{formatKoreanPhoneNumber(claimPhone)}</dd></div>
              <div className="flex items-center justify-between gap-4"><dt className="text-slate-500">연결 코드</dt><dd className="flex items-center gap-2"><span className="font-mono text-lg font-bold text-emerald-700">{claimCode}</span><CopyButton value={claimCode} label="코드 복사" /></dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">만료</dt><dd className="font-semibold text-slate-900">{formatDateTime(claimExpires)}</dd></div>
            </dl>
          </div>
        </section>
      ) : null}

      <MemberFilterControls counts={counts} initialStatus={initialStatus} />

      <section className="space-y-3 pb-member-search-results-shell">
        {allMembers.length ? (
          allMembers.map((member) => {
            const isLinked = Boolean(member.user_id);
            const hasClaimCode = Boolean(member.claim_code_hash);
            const isCurrentMember = member.id === currentMember.id;
            const isInactive = member.status === 'inactive';
            const memberView = getView(member);
            const formattedPhone = formatKoreanPhoneNumber(member.phone);
            const phoneDigits = normalizeDigits(member.phone);

            return (
              <article
                key={member.id}
                data-member-card="true"
                data-member-status={isInactive ? 'inactive' : 'active'}
                data-member-view={memberView}
                data-member-name={member.name}
                data-member-phone={phoneDigits}
                hidden={initialStatus === 'active' ? isInactive : !isInactive}
                className="rounded-3xl bg-white p-4 shadow-sm"
              >
                <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[1fr_auto]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={'/admin/members/' + member.id + '/edit'} className="font-bold text-slate-900 underline-offset-4 hover:underline">{member.name}</Link>
                      <span className={['rounded-full px-2 py-1 text-xs font-semibold', member.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'].join(' ')}>{member.role === 'admin' ? '운영진' : '회원'}</span>
                      {isInactive ? <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">비활성</span> : <span className={['rounded-full px-2 py-1 text-xs font-semibold', isLinked ? 'bg-emerald-100 text-emerald-700' : hasClaimCode ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'].join(' ')}>{isLinked ? '연결 완료' : hasClaimCode ? '연결 대기' : '코드 필요'}</span>}
                      {isCurrentMember ? <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-700">내 계정</span> : null}
                    </div>

                    <dl className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-600 lg:max-w-2xl">
                      <div className="rounded-2xl bg-slate-50 p-3"><dt className="text-xs text-slate-400">연락처</dt><dd className="mt-1 font-medium text-slate-700">{phoneDigits ? <a href={'tel:' + phoneDigits} className="underline-offset-4 hover:underline">{formattedPhone}</a> : '-'}</dd></div>
                      <div className="rounded-2xl bg-slate-50 p-3"><dt className="text-xs text-slate-400">핸디캡</dt><dd className="mt-1 font-medium text-slate-700">{member.handicap ?? 0}</dd></div>
                      <div className="rounded-2xl bg-slate-50 p-3"><dt className="text-xs text-slate-400">가입일</dt><dd className="mt-1 font-medium text-slate-700">{member.joined_on || '-'}</dd></div>
                      <div className="rounded-2xl bg-slate-50 p-3"><dt className="text-xs text-slate-400">코드 만료</dt><dd className="mt-1 font-medium text-slate-700">{member.claim_code_expires_at ? formatDateTime(member.claim_code_expires_at) : '-'}</dd></div>
                    </dl>
                  </div>

                  <div className="grid grid-cols-2 gap-2 lg:w-80 lg:self-start">
                    {isInactive ? (
                      <form action={restoreMemberAction} className="col-span-2">
                        <input type="hidden" name="memberId" value={member.id} />
                        <ConfirmSubmitButton confirmMessage={member.name + ' 회원을 복구할까요?'} className="w-full rounded-2xl bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">복구</ConfirmSubmitButton>
                      </form>
                    ) : (
                      <>

                        {!isLinked ? (
                          <form action={reissueClaimCodeAction}>
                            <input type="hidden" name="memberId" value={member.id} />
                            <button type="submit" className="h-full w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">코드 재발급</button>
                          </form>
                        ) : null}
                        {!isCurrentMember ? (
                          <form action={deactivateMemberAction}>
                            <input type="hidden" name="memberId" value={member.id} />
                            <ConfirmSubmitButton confirmMessage={member.name + ' 회원을 비활성화할까요?'} className="w-full rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 disabled:cursor-not-allowed disabled:opacity-60">비활성화</ConfirmSubmitButton>
                          </form>
                        ) : null}
                      </>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="rounded-3xl bg-white px-5 py-10 text-center shadow-sm">
            <p className="text-sm font-semibold text-slate-700">표시할 회원이 없습니다.</p>
          </div>
        )}
      </section>

      <nav className="parkbuddy-sticky-cta">
        <div data-parkbuddy-sticky-cta="true" className="parkbuddy-sticky-cta__inner">

          <Link href="/admin/members/new" className="flex h-12 items-center justify-center rounded-2xl bg-emerald-600 text-sm font-bold text-white shadow-sm">회원 등록</Link>
        </div>
      </nav>
    </main>
  );
}

```


---

## `src/app/(app)/admin/page.tsx`

```ts
import { redirect } from 'next/navigation';

export default function AdminDashboardRedirectPage() {
  redirect('/');
}

```


---

## `src/app/(app)/admin/rounds/[id]/edit/actions.ts`

```ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/require-member';

function getRequiredText(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${key} is required.`);
  }

  return value.trim();
}

function getOptionalText(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function updateRoundAction(formData: FormData) {
  const { supabase, member } = await requireAdmin();

  const roundId = getRequiredText(formData, 'roundId');
  const title = getRequiredText(formData, 'title');
  const courseName = getOptionalText(formData, 'courseName');
  const playDate = getRequiredText(formData, 'playDate');
  const memo = getOptionalText(formData, 'memo');

  const { error } = await supabase
    .from('rounds')
    .update({
      title,
      course_name: courseName,
      play_date: playDate,
      memo,
      updated_at: new Date().toISOString(),
    })
    .eq('id', roundId)
    .is('deleted_at', null)
    .eq('club_id', member.club_id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/admin/rounds');
  revalidatePath(`/admin/rounds/${roundId}/edit`);
  redirect('/admin/rounds');
}

```


---

## `src/app/(app)/admin/rounds/[id]/edit/page.tsx`

```ts
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/require-member';
import { DeletedRoundOperationBlocked } from '@/components/admin/deleted-round-operation-blocked';
import { updateRoundAction } from './actions';

type EditRoundPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type RoundInfo = {
  id: string;
  title: string | null;
  course_name: string | null;
  play_date: string | null;
  memo: string | null;
  club_id: string;
  deleted_at: string | null;
};

export default async function EditRoundPage({ params }: EditRoundPageProps) {
  const routeParams = await params;
  const { supabase, member } = await requireAdmin();

  const { data: round, error } = await supabase
    .from('rounds')
    .select('id, title, course_name, play_date, memo, club_id, deleted_at')
    .eq('id', routeParams.id)
    .eq('club_id', member.club_id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!round) {
    notFound();
  }

  if (round.deleted_at) {
    return <DeletedRoundOperationBlocked roundTitle={round.title} />;
  }

  const typedRound = round as RoundInfo;

  return (
    <main className="mx-auto max-w-5xl space-y-4 px-3 py-4 sm:px-4 sm:py-5">
      <header className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div>
          <p className="text-sm font-semibold text-emerald-600">라운드 수정</p>
          <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            {typedRound.title ?? '라운드'}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            라운드명, 장소, 날짜, 메모를 수정합니다.
          </p>
        </div>

        <Link
          href="/admin/rounds"
          className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-100 px-4 py-2 text-center text-sm font-semibold text-slate-700"
        >
          라운드 목록
        </Link>
      </header>

      <form action={updateRoundAction} className="grid gap-4 rounded-3xl bg-white p-4 shadow-sm sm:p-5 md:grid-cols-2">
        <input type="hidden" name="roundId" value={typedRound.id} />

        <label className="block">
          <span className="text-sm font-medium text-slate-700">라운드명</span>
          <input
            name="title"
            required
            defaultValue={typedRound.title ?? ''}
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">장소/코스</span>
          <input
            name="courseName"
            defaultValue={typedRound.course_name ?? ''}
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">라운드 날짜</span>
          <input
            type="date"
            name="playDate"
            required
            defaultValue={typedRound.play_date ?? ''}
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>

        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-slate-700">메모</span>
          <textarea
            name="memo"
            rows={5}
            defaultValue={typedRound.memo ?? ''}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>

        <div className="grid gap-2 sm:grid-cols-2 md:col-span-2">
          <button
            type="submit"
            className="h-12 flex-1 rounded-2xl bg-emerald-600 px-4 font-bold text-white"
          >
            수정 저장
          </button>
          <Link
            href="/admin/rounds"
            className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-slate-100 px-4 font-bold text-slate-700"
          >
            취소
          </Link>
        </div>
      </form>
    </main>
  );
}

```


---

## `src/app/(app)/admin/rounds/[id]/pairings/actions.ts`

```ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/require-member';

const PARKBUDDY_VALID_PAIRING_COMBINATIONS: Record<string, string[]> = {
  individual: ['stroke', 'new_peoria', 'match', 'stableford'],
  foursome: ['stroke', 'match'],
  fourball: ['stroke', 'match', 'stableford'],
  scramble: ['stroke', 'match'],
  team_match: ['stroke', 'new_peoria', 'match'],
};

type PairingAssignment = {
  member_id: string;
  group_no: number;
  position: number;
};

function isParkBuddyValidPairingCombination(
  playMode: string,
  scoringType: string,
) {
  return Boolean(
    PARKBUDDY_VALID_PAIRING_COMBINATIONS[playMode]?.includes(scoringType),
  );
}

function getPairingRpcErrorCode(message?: string) {
  if (!message) {
    return 'unknown';
  }

  if (message.includes('AUTH_REQUIRED')) {
    return 'auth_required';
  }

  if (message.includes('ADMIN_REQUIRED')) {
    return 'admin_required';
  }

  if (message.includes('ROUND_NOT_FOUND')) {
    return 'round_not_found';
  }

  if (message.includes('INVALID_GAME_COMBINATION')) {
    return 'invalid_game_combination';
  }

  if (message.includes('INVALID_ASSIGNMENTS')) {
    return 'invalid_assignments';
  }

  if (message.includes('NOT_ENOUGH_PARTICIPANTS')) {
    return 'not_enough_participants';
  }

  if (message.includes('INVALID_GROUP_SIZE')) {
    return 'invalid_group_size';
  }

  if (message.includes('INVALID_PARTICIPANT')) {
    return 'invalid_participant';
  }

  if (message.includes('DUPLICATE_PARTICIPANT')) {
    return 'duplicate_participant';
  }

  if (message.includes('Could not find the function')) {
    return 'rpc_missing';
  }

  if (message.includes('permission denied')) {
    return 'permission_denied';
  }

  return 'unknown';
}

function normalizeGameType(value: FormDataEntryValue | null) {
  const rawValue = String(value ?? '').trim();

  if (rawValue === 'team') {
    return 'team_match';
  }

  return rawValue;
}

function normalizeScoringType(value: FormDataEntryValue | null) {
  const rawValue = String(value ?? '').trim();

  if (rawValue === 'match_play') {
    return 'match';
  }

  return rawValue;
}

function parseAssignmentsJson(value: FormDataEntryValue | null) {
  if (typeof value !== 'string' || !value.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    if (Array.isArray(parsed)) {
      return parsed
        .map((item, index) => {
          if (!item || typeof item !== 'object') {
            return null;
          }

          const row = item as Record<string, unknown>;
          const memberId = String(
            row.member_id ?? row.memberId ?? row.id ?? '',
          ).trim();

          const rawGroupNo = Number(row.group_no ?? row.groupNo ?? row.groupIndex ?? 0);

          if (!memberId || !Number.isFinite(rawGroupNo)) {
            return null;
          }

          return {
            member_id: memberId,
            group_no: rawGroupNo <= 0 ? rawGroupNo + 1 : rawGroupNo,
            position: Number(row.position ?? index + 1),
          };
        })
        .filter((item): item is PairingAssignment => item !== null);
    }

    if (parsed && typeof parsed === 'object') {
      return Object.entries(parsed as Record<string, unknown>)
        .map(([memberId, groupIndex], index) => {
          const numericGroupIndex = Number(groupIndex);

          if (!memberId || !Number.isFinite(numericGroupIndex)) {
            return null;
          }

          return {
            member_id: memberId,
            group_no: numericGroupIndex + 1,
            position: index + 1,
          };
        })
        .filter((item): item is PairingAssignment => item !== null);
    }
  } catch {
    return [];
  }

  return [];
}

function parseAssignmentsFromLegacyFields(formData: FormData) {
  const memberIds = formData
    .getAll('memberId')
    .map((value) => String(value).trim())
    .filter(Boolean);

  return memberIds.map((memberId, index) => ({
    member_id: memberId,
    group_no: Number(formData.get(`groupNo:${memberId}`) ?? 0) + 1,
    position: index + 1,
  }));
}

function getPairingAssignmentsFromForm(formData: FormData) {
  const assignmentsFromJson = parseAssignmentsJson(formData.get('assignments'));

  if (assignmentsFromJson.length > 0) {
    return assignmentsFromJson;
  }

  return parseAssignmentsFromLegacyFields(formData);
}

export async function saveRoundPairingsAction(formData: FormData) {
  const { supabase, member } = await requireAdmin();

  const roundId = String(formData.get('roundId') ?? '').trim();
  const gameType = normalizeGameType(
    formData.get('gameType') ?? formData.get('playMode'),
  );
  const scoringType = normalizeScoringType(formData.get('scoringType'));
  const assignments = getPairingAssignmentsFromForm(formData);

  if (!roundId) {
    redirect('/admin/rounds?error=round_not_found');
  }

  if (!isParkBuddyValidPairingCombination(gameType, scoringType)) {
    redirect(`/admin/rounds/${roundId}/pairings?error=invalid_game_combination`);
  }

  if (assignments.length < 3) {
    redirect(`/admin/rounds/${roundId}/pairings?error=not_enough_participants`);
  }

  const { error } = await supabase.rpc('admin_save_round_pairings', {
    p_round_id: roundId,
    p_game_type: gameType,
    p_scoring_type: scoringType,
    p_assignments: assignments,
  });

  if (error) {
    console.error('admin_save_round_pairings failed', {
      roundId,
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      assignmentsCount: assignments.length,
    });

    redirect(
      `/admin/rounds/${roundId}/pairings?error=${getPairingRpcErrorCode(
        error.message,
      )}`,
    );
  }

  const { error: settingsError } = await supabase.rpc('admin_save_round_game_settings', {
    p_round_id: roundId,
    p_game_type: gameType,
    p_scoring_type: scoringType,
  });

  if (settingsError) {
    console.error('admin_save_round_game_settings failed', {
      roundId,
      message: settingsError.message,
      details: settingsError.details,
      hint: settingsError.hint,
      code: settingsError.code,
    });

    redirect(
      `/admin/rounds/${roundId}/pairings?error=${getPairingRpcErrorCode(
        settingsError.message,
      )}`,
    );
  }

  const { error: pairingMetaError } = await supabase
    .from('rounds')
    .update({
      game_type: gameType,
      scoring_type: scoringType,
    })
    .eq('id', roundId)
    .eq('club_id', member.club_id)
    .is('deleted_at', null);

  if (pairingMetaError) {
    console.error('round pairing metadata update failed', {
      roundId,
      gameType,
      scoringType,
      message: pairingMetaError.message,
      details: pairingMetaError.details,
      hint: pairingMetaError.hint,
      code: pairingMetaError.code,
    });
  }

  revalidatePath('/admin');
  revalidatePath('/admin/rounds');
  revalidatePath(`/admin/rounds/${roundId}/pairings`);
  revalidatePath(`/admin/rounds/${roundId}/scores`);
  revalidatePath(`/admin/rounds/${roundId}/results`);
  revalidatePath('/admin/logs');

  redirect(`/admin/rounds/${roundId}/scores?from=pairings_saved`);
}

```


---

## `src/app/(app)/admin/rounds/[id]/pairings/page.tsx`

```ts
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/require-member';
import { DeletedRoundOperationBlocked } from '@/components/admin/deleted-round-operation-blocked';
import { RoundPairingForm } from '@/components/admin/round-pairing-form';
import { getParkBuddyGameMethodLabel } from '@/lib/round-game-labels';
import { saveRoundPairingsAction } from './actions';

type PairingsPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    saved?: string;
    error?: string;
  }>;
};

type Round = {
  id: string;
  club_id: string;
  deleted_at: string | null;
  title: string | null;
  course_name: string | null;
  play_date: string | null;
  game_type: string | null;
  scoring_type: string | null;
};

type Participant = {
  id: string;
  name: string;
  handicap: number;
  averageStrokes: number | null;
  roundsCount: number;
  teamNo: number | null;
};

type RoundParticipantRow = {
  member_id: string;
  team_no: number | null;
};

type RoundScoreRow = {
  member_id: string;
  strokes: number | null;
};

type RoundGroupMember = {
  member_id: string;
  round_groups: {
    group_no: number | null;
  } | null;
};

function getErrorMessage(error?: string) {
  switch (error) {
    case 'auth_required':
      return '로그인이 필요합니다.';
    case 'admin_required':
      return '운영진만 조 편성을 저장할 수 있습니다.';
    case 'round_not_found':
      return '라운드를 찾을 수 없습니다.';
    case 'invalid_game_combination':
      return '선택한 경기 형태와 점수 계산 방식 조합이 올바르지 않습니다.';
    case 'not_enough_participants':
      return '조 편성을 위해 최소 3명 이상의 참가자가 필요합니다.';
    case 'invalid_group_size':
      return '각 조는 최소 3명, 최대 4명으로 편성해야 합니다.';
    case 'invalid_participant':
      return '라운드 참가자가 아니거나 활성 회원이 아닌 사용자가 포함되어 있습니다.';
    case 'duplicate_participant':
      return '같은 참가자가 중복으로 포함되어 있습니다.';
    case 'rpc_missing':
      return 'Supabase 조 편성 함수가 없습니다. 0013 SQL을 먼저 실행해 주세요.';
    case 'permission_denied':
      return '조 편성 저장 권한이 없습니다.';
    case 'unknown':
      return '알 수 없는 오류가 발생했습니다.';
    default:
      return null;
  }
}

function formatDate(value?: string | null) {
  if (!value) {
    return '-';
  }

  return new Date(`${value}T00:00:00`).toLocaleDateString('ko-KR');
}

export default async function PairingsPage({
  params,
  searchParams,
}: PairingsPageProps) {
  const routeParams = await params;
  const queryParams = await searchParams;
  const { supabase, member } = await requireAdmin();

  const { data: round, error: roundError } = await supabase
    .from('rounds')
    .select(
      `
      id,
      club_id,
      title,
      course_name,
      play_date,
      game_type,
      scoring_type,
      deleted_at
    `,
    )
    .eq('id', routeParams.id)
    .eq('club_id', member.club_id)
    .maybeSingle();

  if (roundError) {
    throw new Error(roundError.message);
  }

  if (!round) {
    notFound();
  }

  if (round.deleted_at) {
    return <DeletedRoundOperationBlocked roundTitle={round.title} />;
  }

  const typedRound = round as Round;

  const { data: participantRows, error: participantsError } = await supabase
    .from('round_participants')
    .select('member_id, team_no')
    .eq('round_id', typedRound.id);

  if (participantsError) {
    throw new Error(participantsError.message);
  }

  const typedParticipantRows = (participantRows ?? []) as RoundParticipantRow[];
  const memberIds = typedParticipantRows.map((row) => String(row.member_id));
  const teamNoByMemberId = typedParticipantRows.reduce<Record<string, number | null>>((acc, row) => {
    acc[String(row.member_id)] = typeof row.team_no === 'number' ? row.team_no : null;
    return acc;
  }, {});

  const { data: members, error: membersError } = memberIds.length
    ? await supabase
        .from('members')
        .select('id, name, handicap')
        .eq('club_id', member.club_id)
        .eq('status', 'active')
        .in('id', memberIds)
        .order('handicap', { ascending: true })
        .order('name', { ascending: true })
    : { data: [], error: null };

  if (membersError) {
    throw new Error(membersError.message);
  }


  const { data: scoreRows, error: scoreRowsError } = memberIds.length
    ? await supabase
        .from('round_scores')
        .select('member_id, strokes')
        .in('member_id', memberIds)
        .not('strokes', 'is', null)
    : { data: [], error: null };

  if (scoreRowsError && scoreRowsError.code !== '42P01') {
    throw new Error(scoreRowsError.message);
  }

  const scoreStatsByMemberId = ((scoreRows ?? []) as RoundScoreRow[]).reduce<
    Record<string, { total: number; count: number }>
  >((acc, row) => {
    const memberId = String(row.member_id);
    const strokes = Number(row.strokes ?? NaN);

    if (!Number.isFinite(strokes)) {
      return acc;
    }

    const current = acc[memberId] ?? { total: 0, count: 0 };
    current.total += strokes;
    current.count += 1;
    acc[memberId] = current;

    return acc;
  }, {});

  const { data: existingRows, error: existingError } = await supabase
    .from('round_group_members')
    .select(
      `
      member_id,
      round_groups:round_group_id(group_no)
    `,
    )
    .eq('round_id', typedRound.id);

  if (existingError && existingError.code !== '42P01') {
    throw new Error(existingError.message);
  }

  const existingAssignments = ((existingRows ?? []) as unknown as RoundGroupMember[])
    .filter((row) => row.round_groups?.group_no)
    .reduce<Record<string, number>>((acc, row) => {
      acc[row.member_id] = Math.max(0, Number(row.round_groups?.group_no ?? 1) - 1);
      return acc;
    }, {});

  const participants = (members ?? []).map((row) => {
    const memberId = String(row.id);
    const scoreStats = scoreStatsByMemberId[memberId];

    return {
      id: memberId,
      name: String(row.name),
      handicap: Number(row.handicap ?? 0),
      averageStrokes: scoreStats?.count ? scoreStats.total / scoreStats.count : null,
      roundsCount: scoreStats?.count ?? 0,
      teamNo: teamNoByMemberId[memberId] ?? null,
    };
  }) satisfies Participant[];

  const errorMessage = getErrorMessage(queryParams.error);

  return (
    <main className="mx-auto max-w-7xl space-y-4 px-3 py-4 sm:px-4 sm:py-5">
      <header className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div>
          <p className="text-sm font-semibold text-emerald-600">
            조 편성
          </p>
          <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            {typedRound.title ?? '라운드'}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {typedRound.course_name ?? '-'} · {formatDate(typedRound.play_date)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap lg:justify-end">
          <Link
            href={`/admin/rounds/${typedRound.id}/participants`}
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-100 px-4 py-2 text-center text-sm font-semibold text-slate-700"
          >
            참가자 선택
          </Link>
          <Link
            href="/admin/rounds"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white"
          >
            라운드 목록
          </Link>
        </div>
      </header>


      <section data-round-detail-mobile-summary className="grid grid-cols-3 gap-2 rounded-3xl bg-white p-3 text-center shadow-sm sm:hidden">
        <div className="rounded-2xl bg-slate-50 px-2 py-2">
          <p className="text-[11px] font-medium text-slate-500">일자</p>
          <p className="mt-1 truncate text-xs font-bold text-slate-900">{formatDate(typedRound.play_date)}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-2 py-2">
          <p className="text-[11px] font-medium text-slate-500">경기 방식</p>
          <p className="mt-1 truncate text-xs font-bold text-slate-900">{getParkBuddyGameMethodLabel(typedRound.game_type, typedRound.scoring_type)}</p>
        </div>
        <div className="rounded-2xl bg-emerald-50 px-2 py-2">
          <p className="text-[11px] font-medium text-emerald-700">참가</p>
          <p className="mt-1 text-xs font-bold text-emerald-900">{participants.length}명</p>
        </div>
      </section>

      {queryParams.saved && (
        <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
          조 편성이 저장되었습니다.
        </section>
      )}

      {errorMessage && (
        <section className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
          {errorMessage}
        </section>
      )}

      {participants.length ? (
        <RoundPairingForm
          roundId={typedRound.id}
          participants={participants}
          defaultPlayMode={typedRound.game_type as never}
          defaultScoringType={typedRound.scoring_type as never}
          defaultAssignments={existingAssignments}
          action={saveRoundPairingsAction}
        />
      ) : (
        <section className="rounded-3xl bg-white p-5 text-center shadow-sm sm:p-8">
          <p className="font-semibold text-slate-900">
            아직 참가자가 없습니다.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            조 편성 전에 참가자를 먼저 선택해 주세요.
          </p>
          <Link
            href={`/admin/rounds/${typedRound.id}/participants`}
            className="mt-5 inline-flex rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white"
          >
            참가자 선택하기
          </Link>
        </section>
      )}
    </main>
  );
}

```


---

## `src/app/(app)/admin/rounds/[id]/participants/actions.ts`

```ts
'use server';

function getParticipantMemberIdsFromForm(formData: FormData) {
  const ids = new Set<string>();

  function addValue(value: FormDataEntryValue) {
    if (typeof value !== 'string') {
      return;
    }

    const trimmed = value.trim();
    if (!trimmed) {
      return;
    }

    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            if (typeof item === 'string' && item.trim()) {
              ids.add(item.trim());
            }
          }
          return;
        }
      } catch {
        // 일반 체크박스 값이면 JSON 파싱 실패는 무시합니다.
      }
    }

    for (const item of trimmed.split(',')) {
      const candidate = item.trim();
      if (candidate) {
        ids.add(candidate);
      }
    }
  }

  for (const [key, value] of formData.entries()) {
    const normalizedKey = key.toLowerCase();

    if (
      normalizedKey === 'memberids' ||
      normalizedKey === 'memberid' ||
      normalizedKey === 'selectedmemberids' ||
      normalizedKey === 'selectedmembers' ||
      normalizedKey === 'participants'
    ) {
      addValue(value);
    }
  }

  return Array.from(ids);
}


import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/require-member';

function getRoundParticipantErrorCode(message?: string) {
  if (!message) {
    return 'unknown';
  }

  if (message.includes('AUTH_REQUIRED')) {
    return 'auth_required';
  }

  if (message.includes('ADMIN_REQUIRED')) {
    return 'admin_required';
  }

  if (message.includes('ROUND_NOT_FOUND')) {
    return 'round_not_found';
  }

  if (message.includes('INVALID_PARTICIPANT')) {
    return 'invalid_participant';
  }

  if (message.includes('Could not find the function')) {
    return 'rpc_missing';
  }

  if (message.includes('permission denied')) {
    return 'permission_denied';
  }

  return 'unknown';
}

export async function updateRoundParticipantsAction(formData: FormData) {
  const memberIds = getParticipantMemberIdsFromForm(formData);

  const { supabase } = await requireAdmin();

  const roundId = String(formData.get('roundId') ?? '').trim();


  if (!roundId) {
    redirect('/admin/rounds?error=round_not_found');
  }

  const { error } = await supabase.rpc('admin_set_round_participants', {
    p_round_id: roundId,
    p_member_ids: memberIds,
  });

  if (error) {
    console.error('admin_set_round_participants failed', {
      roundId,
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    redirect(
      `/admin/rounds/${roundId}/participants?error=${getRoundParticipantErrorCode(
        error.message,
      )}`,
    );
  }

  revalidatePath('/admin');
  revalidatePath('/admin/rounds');
  revalidatePath(`/admin/rounds/${roundId}/participants`);
    redirect(`/admin/rounds/${roundId}/pairings`);
revalidatePath('/admin/logs');

  redirect(`/admin/rounds/${roundId}/participants?updated=1`);
}

```


---

## `src/app/(app)/admin/rounds/[id]/participants/page.tsx`

```ts
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LinkedEventContextCard } from '@/components/admin/linked-event-context-card';
import { requireAdmin } from '@/lib/auth/require-member';
import { getRoundLinkedEventContexts } from '@/lib/round-linked-event-context';
import { updateRoundParticipantsAction } from './actions';
import { ParticipantSelectionEnhancer } from '@/components/admin/participant-selection-enhancer';


type RoundParticipantsPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
    updated?: string;
  }>;
};

type Round = {
  id: string;
  title: string | null;
  course_name: string | null;
  play_date: string | null;
  start_time: string | null;
  status: string;
  event_id: string | null;
};

type Member = {
  id: string;
  name: string;
  phone: string | null;
  handicap: number | null;
  role: 'admin' | 'member';
};

type RoundParticipant = {
  member_id: string;
};

function getErrorMessage(error?: string) {
  switch (error) {
    case 'auth_required':
      return '로그인이 필요합니다.';
    case 'admin_required':
      return '운영진만 참가자를 관리할 수 있습니다.';
    case 'round_not_found':
      return '라운드를 찾을 수 없습니다.';
    case 'invalid_participant':
      return '선택할 수 없는 회원이 포함되어 있습니다.';
    case 'rpc_missing':
      return 'Supabase 참가자 관리 함수가 없습니다. 0012 SQL을 먼저 실행해 주세요.';
    case 'permission_denied':
      return '참가자 관리 권한이 없습니다.';
    case 'unknown':
      return '알 수 없는 오류가 발생했습니다.';
    default:
      return null;
  }
}

function formatDate(value?: string | null) {
  if (!value) {
    return '-';
  }

  return new Date(`${value}T00:00:00`).toLocaleDateString('ko-KR');
}

function formatTime(value?: string | null) {
  if (!value) {
    return '-';
  }

  return value.slice(0, 5);
}

export default async function RoundParticipantsPage({
  params,
  searchParams,
}: RoundParticipantsPageProps) {
  const routeParams = await params;
  const queryParams = await searchParams;
  const { supabase, member: currentMember } = await requireAdmin();

  const { data: round, error: roundError } = await supabase
    .from('rounds')
    .select(
      `
      id,
      title,
      course_name,
      play_date,
      start_time,
      status,
      event_id
    `,
    )
    .eq('id', routeParams.id)
    .eq('club_id', currentMember.club_id)
    .maybeSingle();

  if (roundError) {
    throw new Error(roundError.message);
  }

  if (!round) {
    notFound();
  }

  const { data: members, error: membersError } = await supabase
    .from('members')
    .select(
      `
      id,
      name,
      phone,
      handicap,
      role
    `,
    )
    .eq('club_id', currentMember.club_id)
    .eq('status', 'active')
    .order('name', { ascending: true });

  if (membersError) {
    throw new Error(membersError.message);
  }

  const { data: participants, error: participantsError } = await supabase
    .from('round_participants')
    .select('member_id')
    .eq('round_id', routeParams.id)
    .eq('status', 'confirmed');

  if (participantsError && participantsError.code !== '42P01') {
    throw new Error(participantsError.message);
  }

  const activeMembers = (members ?? []) as Member[];
  const selectedMemberIds = new Set(
    ((participants ?? []) as RoundParticipant[]).map(
      (participant) => participant.member_id,
    ),
  );
  const selectedCount = selectedMemberIds.size;
  const currentRound = round as Round;
  const linkedEventContexts = await getRoundLinkedEventContexts(
    supabase,
    currentMember.club_id,
    [currentRound.event_id],
  );
  const linkedEventContext = currentRound.event_id ? linkedEventContexts.get(currentRound.event_id) : null;
  const errorMessage = getErrorMessage(queryParams.error);

  return (
    <main className="mx-auto max-w-7xl space-y-3 px-3 py-3 sm:space-y-4 sm:px-4 sm:py-5">
      {linkedEventContext && <LinkedEventContextCard context={linkedEventContext} />}

      <header className="grid gap-3 rounded-3xl bg-white p-4 shadow-sm lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div>
          <p className="text-xs font-semibold text-emerald-600 sm:text-sm">
            라운드 참가자
          </p>
          <h1 className="mt-1 text-lg font-bold tracking-tight text-slate-900 sm:text-2xl">
            {currentRound.title ?? '라운드'}
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            {currentRound.course_name ?? '-'} · {formatDate(currentRound.play_date)} ·{' '}
            {formatTime(currentRound.start_time)}
          </p>
        </div>

        <Link
          href="/admin/rounds"
          className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
        >
          목록
        </Link>
      </header>


      {/* 모바일/태블릿에서 라운드 맥락을 짧게 확인할 수 있는 압축 요약입니다. */}
      <section data-round-detail-mobile-summary className="grid grid-cols-3 gap-2 rounded-3xl bg-white p-2.5 text-center shadow-sm sm:hidden">
        <div className="rounded-2xl bg-slate-50 px-2 py-2">
          <p className="text-[11px] font-medium text-slate-500">일자</p>
          <p className="mt-1 truncate text-xs font-bold text-slate-900">{formatDate(currentRound.play_date)}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-2 py-2">
          <p className="text-[11px] font-medium text-slate-500">시간</p>
          <p className="mt-1 truncate text-xs font-bold text-slate-900">{formatTime(currentRound.start_time)}</p>
        </div>
        <div className="rounded-2xl bg-emerald-50 px-2 py-2">
          <p className="text-[11px] font-medium text-emerald-700">선택</p>
          <p className="mt-1 text-xs font-bold text-emerald-900">{selectedCount}명</p>
        </div>
      </section>

      {queryParams.updated && (
        <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
          참가자 목록이 저장되었습니다.
        </section>
      )}

      {errorMessage && (
        <section className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
          {errorMessage}
        </section>
      )}

      <form action={updateRoundParticipantsAction} className="space-y-3 pb-24 sm:space-y-4 sm:pb-0">
        <input type="hidden" name="roundId" value={currentRound.id} />

        <ParticipantSelectionEnhancer />

        <section className="rounded-3xl bg-white p-3 shadow-sm sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <h2 className="font-bold text-slate-900">활성 회원</h2>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                참가할 회원을 선택하세요. 현재 <span data-selected-count-output>{selectedCount}</span>명 선택됨.
              </p>
            </div>

          </div>

          <div className="mt-3 grid gap-2 sm:mt-4 sm:grid-cols-2 xl:grid-cols-3">
            {activeMembers.length ? (
              activeMembers.map((member) => (
                <label
                  key={member.id}
                  data-member-row
                  className="flex min-h-[68px] cursor-pointer items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 px-3 py-2.5 transition hover:border-emerald-200 hover:bg-emerald-50/50 sm:min-h-20 sm:py-3"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900 sm:text-base">
                        {member.name}
                      </p>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 sm:py-1 sm:text-xs">
                        {member.role === 'admin' ? '운영진' : '회원'}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                      {member.phone ?? '-'} · H {member.handicap ?? 0}
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="memberIds"
                    value={member.id}
                    defaultChecked={selectedMemberIds.has(member.id)}
                    className="h-7 w-7 shrink-0 rounded border-slate-300 text-emerald-600"
                  />
                </label>
              ))
            ) : (
              <div className="py-10 text-center">
                <p className="text-sm font-semibold text-slate-700">
                  선택할 수 있는 활성 회원이 없습니다.
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  먼저 회원을 등록하거나 비활성 회원을 복구해 주세요.
                </p>
              </div>
            )}
          </div>
        </section>

        <div className="sticky bottom-24 z-20 mx-auto w-full max-w-2xl rounded-3xl border border-white/70 bg-white/95 p-2 shadow-xl backdrop-blur sm:static sm:max-w-none sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-none">
          <button
            type="submit"
            className="h-12 w-full rounded-2xl bg-emerald-600 px-5 text-sm font-bold text-white"
          >
            참가자 저장 · 선택 <span data-selected-count-label>{selectedCount}명</span>
          </button>
        </div>
      </form>
    </main>
  );
}

```


---

## `src/app/(app)/admin/rounds/[id]/results/page.tsx`

```ts
import Link from 'next/link';
import { ShareResultSummaryButton } from '@/components/share-result-summary-button';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/require-member';

type ResultsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type RoundInfo = {
  id: string;
  title: string | null;
  course_name: string | null;
  play_date: string | null;
  game_type: string | null;
  scoring_type: string | null;
  club_id: string;
};

type ScoreRow = {
  member_id: string;
  strokes: number | null;
  stableford_points: number | null;
  memo: string | null;
  member:
    | {
        id: string;
        name: string;
        handicap: number | null;
      }
    | null;
};

type RankedScore = ScoreRow & {
  rank: number;
  displayScore: string;
  grossScore: string;
  netScore: string;
  sortValue: number;
  hasScore: boolean;
};

function getGameTypeLabel(value?: string | null) {
  switch (value) {
    case 'individual':
      return '개인전';
    case 'foursome':
      return '포섬';
    case 'fourball':
      return '포볼';
    case 'scramble':
      return '스크램블';
    case 'team_match':
      return '청백전';
    default:
      return '미지정';
  }
}

function getScoringTypeLabel(value?: string | null) {
  switch (value) {
    case 'stroke':
      return '스트로크 플레이';
    case 'new_peoria':
      return '신페리오';
    case 'match':
      return '매치 플레이';
    case 'stableford':
      return '스테이블포드';
    default:
      return '미지정';
  }
}

function formatDate(value?: string | null) {
  if (!value) {
    return '-';
  }

  return new Date(`${value}T00:00:00`).toLocaleDateString('ko-KR');
}

function getNetScore(strokes: number | null, handicap: number | null) {
  if (typeof strokes !== 'number') {
    return null;
  }

  return strokes - (handicap ?? 0);
}

function rankScores(scores: ScoreRow[], scoringType?: string | null): RankedScore[] {
  const usesStableford = scoringType === 'stableford';
  const usesNetScore = scoringType === 'new_peoria';

  const ranked = scores
    .map((score) => {
      const netScore = getNetScore(score.strokes, score.member?.handicap ?? 0);
      const scoreValue = usesStableford
        ? score.stableford_points
        : usesNetScore
          ? netScore
          : score.strokes;

      const hasScore = typeof scoreValue === 'number';

      return {
        ...score,
        rank: 0,
        hasScore,
        grossScore:
          typeof score.strokes === 'number' ? `${score.strokes}타` : '미입력',
        netScore: typeof netScore === 'number' ? `${netScore}타` : '미입력',
        sortValue: hasScore
          ? usesStableford
            ? -scoreValue
            : scoreValue
          : Number.POSITIVE_INFINITY,
        displayScore: hasScore
          ? usesStableford
            ? `${scoreValue}점`
            : `${scoreValue}타`
          : '미입력',
      };
    })
    .sort((left, right) => {
      if (left.sortValue !== right.sortValue) {
        return left.sortValue - right.sortValue;
      }

      return (left.member?.name ?? '').localeCompare(right.member?.name ?? '');
    });

  let previousSortValue: number | null = null;
  let previousRank = 0;

  return ranked.map((score, index) => {
    if (!score.hasScore) {
      return {
        ...score,
        rank: 0,
      };
    }

    const nextRank =
      previousSortValue === score.sortValue ? previousRank : index + 1;

    previousSortValue = score.sortValue;
    previousRank = nextRank;

    return {
      ...score,
      rank: nextRank,
    };
  });
}

function getCalculationNote(scoringType?: string | null) {
  switch (scoringType) {
    case 'stroke':
      return '총 타수가 낮을수록 높은 순위로 계산합니다.';
    case 'stableford':
      return '스테이블포드 포인트가 높을수록 높은 순위로 계산합니다.';
    case 'new_peoria':
      return '현재는 회원 핸디캡을 반영한 보정 타수 기준으로 임시 순위를 계산합니다. 정식 신페리오 숨김홀 계산은 홀별 스코어 입력 후 확장합니다.';
    case 'match':
      return '현재는 입력된 총 타수 기준 임시 순위입니다. 홀별 매치 승점 계산은 홀별 스코어 입력 후 확장합니다.';
    default:
      return '경기 방식이 아직 지정되지 않았습니다. 조 편성에서 경기 방식과 점수 계산 방식을 먼저 저장하세요.';
  }
}

export default async function RoundResultsPage({ params }: ResultsPageProps) {
  const routeParams = await params;
  const { supabase, member } = await requireAdmin();

  const { data: round, error: roundError } = await supabase
    .from('rounds')
    .select(
      `
      id,
      title,
      course_name,
      play_date,
      game_type,
      scoring_type,
      club_id
    `,
    )
    .eq('id', routeParams.id)
    .eq('club_id', member.club_id)
    .maybeSingle();

  if (roundError) {
    throw new Error(roundError.message);
  }

  if (!round) {
    notFound();
  }

  const typedRound = round as RoundInfo;

  const { data: scores, error: scoresError } = await supabase
    .from('round_scores')
    .select(
      `
      member_id,
      strokes,
      stableford_points,
      memo,
      member:member_id (
        id,
        name,
        handicap
      )
    `,
    )
    .eq('round_id', typedRound.id)
    .order('strokes', { ascending: true, nullsFirst: false });

  if (scoresError && scoresError.code !== '42P01') {
    throw new Error(scoresError.message);
  }

  const rankedScores = rankScores(
    (scores ?? []) as unknown as ScoreRow[],
    typedRound.scoring_type,
  );

  const leader = rankedScores.find((score) => score.rank === 1);
  const completedScoreCount = rankedScores.filter((score) => score.hasScore).length;
  const missingScoreCount = rankedScores.filter((score) => !score.hasScore).length;
  const completionRate = rankedScores.length
    ? Math.round((completedScoreCount / rankedScores.length) * 100)
    : 0;
  const podiumScores = rankedScores.filter((score) => score.rank > 0 && score.rank <= 3);
  const podiumSummary = podiumScores.length
    ? podiumScores
        .map(
          (score) =>
            `${score.rank}위 ${score.member?.name ?? '이름 없는 회원'} ${score.displayScore}`,
        )
        .join('\n')
    : '아직 순위가 없습니다.';
  const shareSummary = [
    `[ParkBuddy] ${typedRound.title ?? '라운드 결과'}`,
    `일시: ${formatDate(typedRound.play_date)}`,
    `장소: ${typedRound.course_name ?? '-'}`,
    `현재 1위: ${leader?.member?.name ?? '-'} ${leader?.displayScore ?? ''}`.trim(),
    '상위 3명:',
    podiumSummary,
    `입력 완료: ${completedScoreCount}/${rankedScores.length}명 (${completionRate}%)`,
    missingScoreCount > 0 ? `미입력: ${missingScoreCount}명` : '모든 스코어 입력 완료',
  ].join('\n');

  return (
    <main className="mx-auto max-w-7xl space-y-4 px-3 pb-32 pt-4 sm:px-4 sm:pb-28 sm:pt-5">
      <header className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
        <div>
          <p className="text-sm font-semibold text-emerald-600">
            스코어 결과
          </p>
          <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            {typedRound.title ?? '라운드 결과'}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {typedRound.course_name ?? '-'} · {formatDate(typedRound.play_date)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 rounded-3xl bg-white p-3 text-center shadow-sm lg:grid-cols-1 lg:text-left">
          <div className="rounded-2xl bg-slate-50 px-3 py-2">
            <p className="text-xs text-slate-500">경기 형태</p>
            <p className="mt-1 text-sm font-bold text-slate-900">
              {getGameTypeLabel(typedRound.game_type)}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-3 py-2">
            <p className="text-xs text-slate-500">점수 계산</p>
            <p className="mt-1 text-sm font-bold text-slate-900">
              {getScoringTypeLabel(typedRound.scoring_type)}
            </p>
          </div>
        </div>
      </header>

      <section data-result-summary-ux className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
          <div>
            <p className="text-xs font-bold text-emerald-700">결과 요약</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-black text-emerald-950">
                현재 1위 · {leader?.member?.name ?? '-'}
              </h2>
              <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-emerald-800 shadow-sm">
                {leader?.displayScore ?? '-'}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-emerald-800">
              입력 완료 {completedScoreCount}/{rankedScores.length}명 · 완료율 {completionRate}%
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/80">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: completionRate + '%' }} />
            </div>
          </div>

          <div className="rounded-2xl bg-white/80 p-3">
            <p className="text-xs font-bold text-emerald-700">상위 3명</p>
            <div className="mt-2 grid gap-1 text-sm text-emerald-950">
              {podiumScores.length ? (
                podiumScores.map((score) => (
                  <p key={score.member_id} className="truncate font-semibold">
                    {score.rank}위 · {score.member?.name ?? '이름 없는 회원'} · {score.displayScore}
                  </p>
                ))
              ) : (
                <p className="text-emerald-800">아직 순위가 없습니다.</p>
              )}
            </div>
          </div>
        </div>

        <details className="mt-3 rounded-2xl border border-emerald-200 bg-white/80 p-3">
          <summary className="cursor-pointer text-sm font-bold text-emerald-900">
            공유/인쇄
          </summary>
          <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <p className="whitespace-pre-line rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                {shareSummary}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 lg:w-56 lg:grid-cols-1">
              <ShareResultSummaryButton
                summary={shareSummary}
                label="요약 복사"
                copiedLabel="요약 복사 완료"
              />
              <Link
                href={`/admin/rounds/${typedRound.id}/results/print`}
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white"
              >
                인쇄용 결과표
              </Link>
            </div>
          </div>
        </details>
      </section>

      <details className="rounded-3xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-800">
        <summary className="cursor-pointer font-bold text-blue-900">계산 기준</summary>
        <p className="mt-2">{getCalculationNote(typedRound.scoring_type)}</p>
      </details>

      <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-3 sm:px-5 sm:py-4">
          <h2 className="font-bold text-slate-900">결과 순위</h2>
        </div>

        <div className="divide-y divide-slate-100">
          {rankedScores.length ? (
            rankedScores.map((score) => (
              <article
                key={score.member_id}
                className={`${score.hasScore ? 'bg-white' : 'bg-amber-50/50'} grid grid-cols-[auto_minmax(0,1fr)] gap-3 px-4 py-3 sm:grid-cols-[80px_minmax(0,1fr)_220px] sm:px-5 sm:py-4`}
              >
                <div className="flex items-center">
                  <span className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700">
                    {score.rank ? `${score.rank}위` : '미입력'}
                  </span>
                </div>

                <div>
                  <p className="font-bold text-slate-900">
                    {score.member?.name ?? '이름 없는 회원'}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    핸디캡 {score.member?.handicap ?? 0}
                  </p>
                  {score.memo && (
                    <p className="mt-2 text-sm text-slate-500">{score.memo}</p>
                  )}
                </div>

                <div className="col-span-2 flex flex-row flex-wrap items-center justify-between gap-2 rounded-2xl bg-slate-50 px-3 py-2 sm:col-span-1 sm:flex-col sm:items-end sm:justify-center sm:bg-transparent sm:px-0 sm:py-0">
                  <span className="text-lg font-bold text-emerald-700 sm:text-xl">
                    {score.hasScore ? score.displayScore : '미입력'}
                  </span>
                  <span className="text-sm text-slate-500">
                    총 타수 {score.grossScore}
                  </span>
                  <span className="text-sm text-slate-500">
                    보정 타수 {score.netScore}
                  </span>
                </div>
              </article>
            ))
          ) : (
            <div className="px-5 py-12 text-center">
              <p className="text-sm font-semibold text-slate-700">
                스코어가 없습니다.
              </p>
            </div>
          )}
        </div>
      </section>

      <div className="parkbuddy-sticky-cta">
        <div data-parkbuddy-sticky-cta="true" className="parkbuddy-sticky-cta__inner">
          <Link
            href="/admin/rounds"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-100 px-4 py-2 text-center text-sm font-bold text-slate-700"
          >
            라운드 목록
          </Link>
          <Link
            href={`/admin/rounds/${typedRound.id}/scores`}
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-emerald-600 px-4 py-2 text-center text-sm font-bold text-white"
          >
            스코어 입력
          </Link>
        </div>
      </div>
    </main>
  );
}

```


---

## `src/app/(app)/admin/rounds/[id]/results/print/page.tsx`

```ts
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/require-member';
import { DeletedRoundOperationBlocked } from '@/components/admin/deleted-round-operation-blocked';
import { PrintButton } from '@/components/print-button';

type PrintResultsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type RoundInfo = {
  id: string;
  title: string | null;
  course_name: string | null;
  play_date: string | null;
  game_type: string | null;
  scoring_type: string | null;
  club_id: string;
  deleted_at: string | null;
};

type ScoreRow = {
  member_id: string;
  strokes: number | null;
  stableford_points: number | null;
  memo: string | null;
  member:
    | {
        id: string;
        name: string;
        handicap: number | null;
      }
    | null;
};

type RankedScore = ScoreRow & {
  rank: number | null;
  grossLabel: string;
  netLabel: string;
  resultLabel: string;
  sortValue: number;
  hasScore: boolean;
};

function getGameTypeLabel(value?: string | null) {
  switch (value) {
    case 'individual':
      return '개인전';
    case 'foursome':
      return '포섬';
    case 'fourball':
      return '포볼';
    case 'scramble':
      return '스크램블';
    case 'team_match':
      return '청백전';
    default:
      return '미지정';
  }
}

function getScoringTypeLabel(value?: string | null) {
  switch (value) {
    case 'stroke':
      return '스트로크 플레이';
    case 'new_peoria':
      return '신페리오';
    case 'match':
    case 'match_play':
      return '매치 플레이';
    case 'stableford':
      return '스테이블포드';
    default:
      return '미지정';
  }
}

function formatDate(value?: string | null) {
  if (!value) {
    return '-';
  }

  return new Date(`${value}T00:00:00`).toLocaleDateString('ko-KR');
}

function rankScores(scores: ScoreRow[], scoringType?: string | null): RankedScore[] {
  const usesStableford = scoringType === 'stableford';

  const ranked = scores
    .map((score) => {
      const handicap = score.member?.handicap ?? 0;
      const grossScore = score.strokes;
      const stablefordPoints = score.stableford_points;
      const hasScore = usesStableford
        ? typeof stablefordPoints === 'number'
        : typeof grossScore === 'number';
      const netScore = typeof grossScore === 'number' ? grossScore - handicap : null;

      return {
        ...score,
        rank: null,
        hasScore,
        sortValue: hasScore
          ? usesStableford
            ? -(stablefordPoints ?? 0)
            : netScore ?? grossScore ?? Number.POSITIVE_INFINITY
          : Number.POSITIVE_INFINITY,
        grossLabel: typeof grossScore === 'number' ? `${grossScore}타` : '스코어 미입력',
        netLabel: typeof netScore === 'number' ? `${netScore}타` : '스코어 미입력',
        resultLabel: hasScore
          ? usesStableford
            ? `${stablefordPoints}점`
            : typeof netScore === 'number'
              ? `${netScore}타`
              : `${grossScore}타`
          : '스코어 미입력',
      };
    })
    .sort((left, right) => {
      if (left.hasScore !== right.hasScore) {
        return left.hasScore ? -1 : 1;
      }

      if (left.sortValue !== right.sortValue) {
        return left.sortValue - right.sortValue;
      }

      return (left.member?.name ?? '').localeCompare(right.member?.name ?? '');
    });

  let previousSortValue: number | null = null;
  let previousRank = 0;

  return ranked.map((score, index) => {
    if (!score.hasScore) {
      return {
        ...score,
        rank: null,
      };
    }

    const nextRank =
      previousSortValue === score.sortValue ? previousRank : index + 1;

    previousSortValue = score.sortValue;
    previousRank = nextRank;

    return {
      ...score,
      rank: nextRank,
    };
  });
}

export default async function RoundResultsPrintPage({ params }: PrintResultsPageProps) {
  const routeParams = await params;
  const { supabase, member } = await requireAdmin();

  const { data: round, error: roundError } = await supabase
    .from('rounds')
    .select(
      `
      id,
      title,
      course_name,
      play_date,
      game_type,
      scoring_type,
      club_id,
      deleted_at
    `,
    )
    .eq('id', routeParams.id)
    .eq('club_id', member.club_id)
    .maybeSingle();

  if (roundError) {
    throw new Error(roundError.message);
  }

  if (!round) {
    notFound();
  }

  if (round.deleted_at) {
    return <DeletedRoundOperationBlocked roundTitle={round.title} />;
  }

  const typedRound = round as RoundInfo;

  const { data: scores, error: scoresError } = await supabase
    .from('round_scores')
    .select(
      `
      member_id,
      strokes,
      stableford_points,
      memo,
      member:member_id (
        id,
        name,
        handicap
      )
    `,
    )
    .eq('round_id', typedRound.id)
    .order('strokes', { ascending: true, nullsFirst: false });

  if (scoresError && scoresError.code !== '42P01') {
    throw new Error(scoresError.message);
  }

  const rankedScores = rankScores(
    (scores ?? []) as unknown as ScoreRow[],
    typedRound.scoring_type,
  );
  const enteredCount = rankedScores.filter((score) => score.hasScore).length;
  const missingCount = rankedScores.length - enteredCount;
  const completionRate = rankedScores.length
    ? Math.round((enteredCount / rankedScores.length) * 100)
    : 0;
  const leader = rankedScores.find((score) => score.hasScore) ?? null;
  const podiumScores = rankedScores
    .filter((score) => score.hasScore && typeof score.rank === 'number' && score.rank <= 3)
    .slice(0, 3);

  return (
    <main className="mx-auto max-w-5xl bg-white px-6 py-8 text-slate-900 print:max-w-none print:px-0 print:py-0">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href={`/admin/rounds/${typedRound.id}/results`}
          className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
        >
          결과 화면으로 돌아가기
        </Link>
        <PrintButton />
      </div>

      <section className="rounded-3xl border border-slate-200 p-6 print:rounded-none print:border-0 print:p-0">
        <header className="border-b border-slate-200 pb-5">
          <p className="text-sm font-semibold text-emerald-700">ParkBuddy 라운드 결과표</p>
          <h1 className="mt-2 text-3xl font-black">{typedRound.title ?? '라운드 결과'}</h1>
          <p className="mt-2 text-sm text-slate-600">
            {typedRound.course_name ?? '-'} · {formatDate(typedRound.play_date)}
          </p>
        </header>

        <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl bg-slate-50 p-4 print:border print:border-slate-200 print:bg-white">
            <p className="text-xs font-semibold text-slate-500">경기 형태</p>
            <p className="mt-1 font-bold">{getGameTypeLabel(typedRound.game_type)}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 print:border print:border-slate-200 print:bg-white">
            <p className="text-xs font-semibold text-slate-500">점수 계산 방식</p>
            <p className="mt-1 font-bold">{getScoringTypeLabel(typedRound.scoring_type)}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 print:border print:border-slate-200 print:bg-white">
            <p className="text-xs font-semibold text-slate-500">입력 완료</p>
            <p className="mt-1 font-bold">{enteredCount}명</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 print:border print:border-slate-200 print:bg-white">
            <p className="text-xs font-semibold text-slate-500">미입력</p>
            <p className="mt-1 font-bold">{missingCount}명</p>
          </div>
        </section>

        <section className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_320px] print:grid-cols-[minmax(0,1fr)_260px]">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 print:bg-white">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">결과 요약</p>
            <h2 className="mt-1 text-2xl font-black text-emerald-950">
              1위 · {leader?.member?.name ?? '-'}
            </h2>
            <p className="mt-1 text-sm text-emerald-800">
              {leader?.resultLabel ?? '-'} · 입력 완료율 {completionRate}%
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white print:border print:border-slate-200">
              <div className="h-full rounded-full bg-emerald-500 print:bg-slate-900" style={{ width: completionRate + '%' }} />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 print:bg-white">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">상위 3명</p>
            <div className="mt-3 space-y-2">
              {podiumScores.length ? (
                podiumScores.map((score) => (
                  <div key={score.member_id} className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 print:border print:border-slate-200">
                    <span className="truncate text-sm font-bold text-slate-900">
                      {score.rank}위 · {score.member?.name ?? '이름 없는 회원'}
                    </span>
                    <span className="shrink-0 text-sm font-black text-emerald-700 print:text-slate-900">
                      {score.resultLabel}
                    </span>
                  </div>
                ))
              ) : (
                <p className="rounded-xl bg-white px-3 py-2 text-sm text-slate-500 print:border print:border-slate-200">
                  아직 순위가 없습니다.
                </p>
              )}
            </div>
          </div>
        </section>

        {missingCount > 0 && (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 print:bg-white">
            스코어 미입력 {missingCount}명은 순위에서 제외됩니다.
          </div>
        )}

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-slate-100 print:bg-white">
              <tr>
                <th className="border-b border-slate-200 px-4 py-3">순위</th>
                <th className="border-b border-slate-200 px-4 py-3">회원명</th>
                <th className="border-b border-slate-200 px-4 py-3">핸디캡</th>
                <th className="border-b border-slate-200 px-4 py-3">총 타수</th>
                <th className="border-b border-slate-200 px-4 py-3">보정 타수</th>
                <th className="border-b border-slate-200 px-4 py-3">결과</th>
                <th className="border-b border-slate-200 px-4 py-3">메모</th>
              </tr>
            </thead>
            <tbody>
              {rankedScores.length ? (
                rankedScores.map((score) => (
                  <tr key={score.member_id} className={!score.hasScore ? 'text-slate-400' : ''}>
                    <td className="border-b border-slate-100 px-4 py-3 font-bold">
                      {score.rank ? `${score.rank}위` : '미입력'}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-3 font-semibold">
                      {score.member?.name ?? '이름 없는 회원'}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-3">
                      {score.member?.handicap ?? 0}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-3">{score.grossLabel}</td>
                    <td className="border-b border-slate-100 px-4 py-3">{score.netLabel}</td>
                    <td className="border-b border-slate-100 px-4 py-3 font-bold">
                      {score.resultLabel}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-3">{score.memo ?? '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                    스코어가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <footer className="mt-6 text-xs text-slate-500">
          출력일: {new Date().toLocaleString('ko-KR')}
        </footer>
      </section>
    </main>
  );
}

```


---

## `src/app/(app)/admin/rounds/[id]/scores/actions.ts`

```ts
﻿'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/require-member';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getScoreRpcErrorCode(message?: string) {
  if (!message) return 'unknown';
  if (message.includes('AUTH_REQUIRED')) return 'auth_required';
  if (message.includes('ADMIN_REQUIRED')) return 'admin_required';
  if (message.includes('ROUND_NOT_FOUND')) return 'round_not_found';
  if (message.includes('INVALID_SCORES')) return 'invalid_scores';
  if (message.includes('INVALID_MEMBER')) return 'invalid_member';
  if (message.includes('INVALID_STROKES')) return 'invalid_strokes';
  if (message.includes('INVALID_STABLEFORD_POINTS')) return 'invalid_points';
  if (message.includes('MEMBER_NOT_IN_ROUND')) return 'member_not_in_round';
  if (message.includes('Could not find the function')) return 'rpc_missing';
  if (message.includes('permission denied')) return 'permission_denied';
  return 'unknown';
}

export async function saveRoundScoresAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const roundId = String(formData.get('roundId') ?? '').trim();

  if (!roundId) {
    redirect('/admin/rounds?error=round_not_found');
  }

  const memberIds = formData.getAll('memberId').map((value) => String(value));
  const scores = memberIds.map((memberId) => ({
    memberId,
    strokes: String(formData.get(`strokes:${memberId}`) ?? '').trim(),
    stablefordPoints: String(formData.get(`stablefordPoints:${memberId}`) ?? '').trim(),
    memo: String(formData.get(`memo:${memberId}`) ?? '').trim(),
  }));

  const { error } = await supabase.rpc('admin_upsert_round_scores', {
    p_round_id: roundId,
    p_scores: scores,
  });

  if (error) {
    console.error('admin_upsert_round_scores failed', {
      roundId,
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    redirect(`/admin/rounds/${roundId}/results?saved=1`);
  }

  revalidatePath('/admin');
  revalidatePath('/admin/rounds');
  revalidatePath(`/admin/rounds/${roundId}/scores`);
  revalidatePath(`/admin/rounds/${roundId}/results`);
  revalidatePath('/admin/logs');

  redirect(`/admin/rounds/${roundId}/results?saved=1`);
}

```


---

## `src/app/(app)/admin/rounds/[id]/scores/page.tsx`

```ts
import { notFound } from 'next/navigation';
import { LinkedEventContextCard } from '@/components/admin/linked-event-context-card';
import { requireAdmin } from '@/lib/auth/require-member';
import { getRoundLinkedEventContexts } from '@/lib/round-linked-event-context';
import { RoundScoreInputForm } from '@/components/admin/round-score-input-form';

type ScoresPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
};

type Participant = {
  member_id: string;
  member: {
    id: string;
    name: string;
    handicap: number | null;
  } | null;
};

type RoundScore = {
  member_id: string;
  strokes: number | null;
  stableford_points: number | null;
  memo: string | null;
};

function getErrorMessage(error?: string) {
  switch (error) {
    case 'auth_required':
      return '로그인이 필요합니다.';
    case 'admin_required':
      return '운영진만 스코어를 입력할 수 있습니다.';
    case 'round_not_found':
      return '라운드를 찾을 수 없습니다.';
    case 'invalid_scores':
      return '스코어 입력값이 올바르지 않습니다.';
    case 'invalid_strokes':
      return '타수는 1 이상 200 이하로 입력해 주세요.';
    case 'invalid_points':
      return '스테이블포드 포인트 값이 올바르지 않습니다.';
    case 'member_not_in_round':
      return '라운드 참가자가 아닌 회원의 스코어는 저장할 수 없습니다.';
    case 'rpc_missing':
      return 'Supabase 스코어 저장 함수가 없습니다. 0014 SQL을 먼저 실행해 주세요.';
    case 'permission_denied':
      return '스코어 저장 권한이 없습니다.';
    default:
      return null;
  }
}

function formatDate(value?: string | null) {
  if (!value) return '-';
  return new Date(`${value}T00:00:00`).toLocaleDateString('ko-KR');
}

export default async function RoundScoresPage({ params, searchParams }: ScoresPageProps) {
  const routeParams = await params;
  const queryParams = await searchParams;
  const { supabase, member } = await requireAdmin();

  const { data: round, error: roundError } = await supabase
    .from('rounds')
    .select('id, title, course_name, play_date, status, club_id, event_id')
    .eq('id', routeParams.id)
    .eq('club_id', member.club_id)
    .maybeSingle();

  if (roundError) throw new Error(roundError.message);
  if (!round) notFound();

  const { data: participantRows, error: participantsError } = await supabase
    .from('round_participants')
    .select('member_id, member:member_id(id, name, handicap)')
    .eq('round_id', round.id)
    .order('created_at', { ascending: true });

  if (participantsError && participantsError.code !== '42P01') {
    throw new Error(participantsError.message);
  }

  const { data: scoreRows, error: scoresError } = await supabase
    .from('round_scores')
    .select('member_id, strokes, stableford_points, memo')
    .eq('round_id', round.id);

  if (scoresError && scoresError.code !== '42P01') {
    throw new Error(scoresError.message);
  }

  const participants = (participantRows ?? []) as unknown as Participant[];
  const scores = (scoreRows ?? []) as RoundScore[];
  const scoreByMemberId = new Map(scores.map((score) => [score.member_id, score]));
  const scoreFormParticipants = participants.map((participant) => {
    const score = scoreByMemberId.get(participant.member_id);
    return {
      memberId: participant.member_id,
      name: participant.member?.name ?? '이름 없는 회원',
      handicap: participant.member?.handicap ?? 0,
      strokes: score?.strokes ?? null,
      stablefordPoints: score?.stableford_points ?? null,
      memo: score?.memo ?? null,
    };
  });
  const linkedEventContexts = await getRoundLinkedEventContexts(
    supabase,
    member.club_id,
    [round.event_id],
  );
  const linkedEventContext = round.event_id ? linkedEventContexts.get(round.event_id) : null;
  const errorMessage = getErrorMessage(queryParams.error);

  return (
    <main className="mx-auto max-w-7xl space-y-4 px-3 py-4 sm:px-4 sm:py-5">
      {linkedEventContext && <LinkedEventContextCard context={linkedEventContext} />}

      <header>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">스코어 입력</h1>
        <p className="mt-1 text-sm text-slate-500">
          {round.title} · {round.course_name} · {formatDate(round.play_date)}
        </p>
      </header>

      {queryParams.saved && (
        <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
          스코어가 저장되었습니다.
        </section>
      )}

      {errorMessage && (
        <section className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
          {errorMessage}
        </section>
      )}


      <RoundScoreInputForm
        roundId={round.id}
        participants={scoreFormParticipants}
        playDateLabel={formatDate(round.play_date)}
      />

    </main>
  );
}

```


---

## `src/app/(app)/admin/rounds/actions.ts`

```ts
'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/require-member';

function getRoundRpcErrorCode(message?: string) {
  if (!message) {
    return 'unknown';
  }

  if (message.includes('AUTH_REQUIRED')) {
    return 'auth_required';
  }

  if (message.includes('ADMIN_REQUIRED')) {
    return 'admin_required';
  }

  if (message.includes('INVALID_TITLE')) {
    return 'invalid_title';
  }

  if (message.includes('INVALID_COURSE_NAME')) {
    return 'invalid_course_name';
  }

  if (message.includes('INVALID_PLAY_DATE')) {
    return 'invalid_play_date';
  }

  if (message.includes('INVALID_ROUND_STATUS')) {
    return 'invalid_round_status';
  }

  if (message.includes('ROUND_NOT_FOUND')) {
    return 'round_not_found';
  }

  if (message.includes('Could not find the function')) {
    return 'rpc_missing';
  }

  if (message.includes('permission denied')) {
    return 'permission_denied';
  }

  return 'unknown';
}

export async function createRoundAction(formData: FormData) {
  const { supabase } = await requireAdmin();

  const title = String(formData.get('title') ?? '').trim();
  const courseName = String(formData.get('courseName') ?? '').trim();
  const playDate = String(formData.get('playDate') ?? '').trim();
  const startTimeValue = String(formData.get('startTime') ?? '').trim();
  const memo = String(formData.get('memo') ?? '').trim();

  if (title.length < 2) {
    redirect('/admin/rounds/new?error=invalid_title');
  }

  if (courseName.length < 2) {
    redirect('/admin/rounds/new?error=invalid_course_name');
  }

  if (!playDate) {
    redirect('/admin/rounds/new?error=invalid_play_date');
  }

  const { error } = await supabase.rpc('admin_create_round', {
    p_title: title,
    p_course_name: courseName,
    p_play_date: playDate,
    p_start_time: startTimeValue || null,
    p_memo: memo || null,
  });

  if (error) {
    console.error('admin_create_round failed', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    redirect(`/admin/rounds/new?error=${getRoundRpcErrorCode(error.message)}`);
  }

  revalidatePath('/admin');
  revalidatePath('/admin/rounds');
  revalidatePath('/admin/logs');

  redirect('/admin/rounds?created=1');
}

export async function updateRoundStatusAction(formData: FormData) {
  const { supabase } = await requireAdmin();

  const roundId = String(formData.get('roundId') ?? '').trim();
  const status = String(formData.get('status') ?? '').trim();

  if (!roundId) {
    redirect('/admin/rounds?error=round_not_found');
  }

  if (!['scheduled', 'completed', 'cancelled'].includes(status)) {
    redirect('/admin/rounds?error=invalid_round_status');
  }

  const { error } = await supabase.rpc('admin_update_round_status', {
    p_round_id: roundId,
    p_status: status,
  });

  if (error) {
    console.error('admin_update_round_status failed', {
      roundId,
      status,
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    redirect(`/admin/rounds?error=${getRoundRpcErrorCode(error.message)}`);
  }

  revalidatePath('/admin');
  revalidatePath('/admin/rounds');
  revalidatePath('/admin/logs');

  redirect('/admin/rounds?statusUpdated=1');
}

export async function duplicateRoundAction(formData: FormData) {
  const roundId = String(formData.get('roundId') ?? '');

  if (!roundId) {
    throw new Error('라운드 ID가 없습니다.');
  }

  const { supabase } = await requireAdmin();

  const { data: newRoundId, error } = await supabase.rpc('admin_duplicate_round', {
    p_round_id: roundId,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/admin/rounds');
  redirect('/admin/rounds/' + newRoundId + '/participants');
}

// PARKBUDDY_ROUND_SOFT_DELETE_ACTIONS_START
export async function adminSoftDeleteRoundAction(formData: FormData) {
  "use server";
  const roundId = String(formData.get("roundId") ?? "").trim();
  if (!roundId) {
    throw new Error("roundId is required.");
  }
  const { supabase } = await requireAdmin();
  const { error } = await supabase.rpc("admin_soft_delete_round", { p_round_id: roundId });
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/admin");
  revalidatePath("/admin/rounds");
  revalidatePath("/admin/rounds/deleted");
  revalidatePath("/admin/logs");
  revalidatePath(`/admin/rounds/${roundId}`);

  redirect("/admin/rounds?roundDeleted=1");
}

export async function adminRestoreRoundAction(formData: FormData) {
  "use server";
  const roundId = String(formData.get("roundId") ?? "").trim();
  if (!roundId) {
    throw new Error("roundId is required.");
  }
  const { supabase } = await requireAdmin();
  const { error } = await supabase.rpc("admin_restore_round", { p_round_id: roundId });
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/admin");
  revalidatePath("/admin/rounds");
  revalidatePath("/admin/rounds/deleted");
  revalidatePath("/admin/logs");
  revalidatePath(`/admin/rounds/${roundId}`);

  redirect("/admin/rounds/deleted?roundRestored=1");
}
// PARKBUDDY_ROUND_SOFT_DELETE_ACTIONS_END

```


---

## `src/app/(app)/admin/rounds/calendar/page.tsx`

```ts
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/require-member';

type CalendarPageProps = {
  searchParams?: Promise<{
    month?: string;
  }>;
};

type RoundRow = {
  id: string;
  title: string | null;
  course_name: string | null;
  play_date: string | null;
  start_time: string | null;
  status: 'scheduled' | 'completed' | 'cancelled' | null;
  game_type: string | null;
  scoring_type: string | null;
};

function getMonthValue(value?: string | null) {
  if (value && /^\d{4}-\d{2}$/.test(value)) {
    return value;
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');

  return `${year}-${month}`;
}

function getMonthRange(monthValue: string) {
  const [yearText, monthText] = monthValue.split('-');
  const year = Number(yearText);
  const month = Number(monthText);

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

function shiftMonth(monthValue: string, offset: number) {
  const [yearText, monthText] = monthValue.split('-');
  const year = Number(yearText);
  const month = Number(monthText);

  const date = new Date(year, month - 1 + offset, 1);
  const nextYear = date.getFullYear();
  const nextMonth = String(date.getMonth() + 1).padStart(2, '0');

  return `${nextYear}-${nextMonth}`;
}

function formatKoreanMonth(monthValue: string) {
  const [yearText, monthText] = monthValue.split('-');

  return `${yearText}년 ${Number(monthText)}월`;
}

function formatDate(value?: string | null) {
  if (!value) {
    return '일자 미정';
  }

  return new Date(`${value}T00:00:00`).toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
}

function formatShortDate(value?: string | null) {
  if (!value) {
    return '-';
  }

  return new Date(`${value}T00:00:00`).toLocaleDateString('ko-KR');
}

function formatTime(value?: string | null) {
  if (!value) {
    return '-';
  }

  return value.slice(0, 5);
}

function getStatusLabel(value?: string | null) {
  switch (value) {
    case 'completed':
      return '완료';
    case 'cancelled':
      return '취소';
    case 'scheduled':
    default:
      return '예정';
  }
}

function getStatusClassName(status?: string | null) {
  switch (status) {
    case 'completed':
      return 'bg-blue-100 text-blue-700 ring-blue-200';
    case 'cancelled':
      return 'bg-red-100 text-red-700 ring-red-200';
    default:
      return 'bg-emerald-100 text-emerald-700 ring-emerald-200';
  }
}

function getGameTypeLabel(value?: string | null) {
  switch (value) {
    case 'individual':
      return '개인전';
    case 'foursome':
      return '포섬';
    case 'fourball':
      return '포볼';
    case 'scramble':
      return '스크램블';
    case 'team_match':
      return '청백전';
    default:
      return '미정';
  }
}

function getScoringTypeLabel(value?: string | null) {
  switch (value) {
    case 'stroke':
      return '스트로크';
    case 'new_peoria':
      return '신페리오';
    case 'match':
    case 'match_play':
      return '매치';
    case 'stableford':
      return '스테이블포드';
    default:
      return '미정';
  }
}

function groupRoundsByDate(rounds: RoundRow[]) {
  return rounds.reduce<Record<string, RoundRow[]>>((acc, round) => {
    const key = round.play_date ?? 'undated';

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(round);

    return acc;
  }, {});
}

function actionLinkClassName(variant: 'default' | 'dark' | 'green' = 'default') {
  if (variant === 'dark') {
    return 'inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-900 px-3 py-2 text-center text-sm font-bold text-white shadow-sm transition hover:bg-slate-800';
  }

  if (variant === 'green') {
    return 'inline-flex min-h-12 items-center justify-center rounded-2xl bg-emerald-600 px-3 py-2 text-center text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700';
  }

  return 'inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-100 px-3 py-2 text-center text-sm font-bold text-slate-700 transition hover:bg-slate-200';
}

export default async function RoundCalendarPage({
  searchParams,
}: CalendarPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const monthValue = getMonthValue(resolvedSearchParams.month);
  const { startDate, endDate } = getMonthRange(monthValue);
  const previousMonth = shiftMonth(monthValue, -1);
  const nextMonth = shiftMonth(monthValue, 1);

  const { supabase, member } = await requireAdmin();

  const { data: rounds, error } = await supabase
    .from('rounds')
    .select(
      `
      id,
      title,
      course_name,
      play_date,
      start_time,
      status,
      game_type,
      scoring_type
    `,
    )
    .eq('club_id', member.club_id)
    .is('deleted_at', null)
    .gte('play_date', startDate)
    .lt('play_date', endDate)
    .order('play_date', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const typedRounds = (rounds ?? []) as RoundRow[];
  const groupedRounds = groupRoundsByDate(typedRounds);
  const dateKeys = Object.keys(groupedRounds).sort();

  return (
    <main className="mx-auto max-w-7xl space-y-4 px-3 py-4 sm:px-4 sm:py-5 lg:px-6">
      <header className="rounded-[2rem] bg-white/80 p-4 shadow-sm ring-1 ring-slate-100 sm:p-5 lg:flex lg:items-end lg:justify-between lg:gap-6">
        <div className="min-w-0">
          <p className="text-sm font-bold text-emerald-600">라운드 일정</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
            {formatKoreanMonth(monthValue)}
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            월별 라운드를 날짜별 카드로 확인하고, 필요한 운영 화면으로 바로 이동합니다.
          </p>
        </div>

        <nav className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3 lg:mt-0 lg:min-w-[28rem]">
          <Link href="/admin/rounds" className={actionLinkClassName()}>
            라운드 목록
          </Link>
          <Link href="/admin/rounds/status" className={actionLinkClassName('dark')}>
            상태별 보기
          </Link>
          <Link href="/admin/rounds/new" className={actionLinkClassName('green')}>
            라운드 생성
          </Link>
        </nav>
      </header>

      <nav className="grid grid-cols-3 items-center gap-2 rounded-[2rem] bg-white p-3 shadow-sm ring-1 ring-slate-100">
        <Link href={`/admin/rounds/calendar?month=${previousMonth}`} className={actionLinkClassName()}>
          이전 달
        </Link>
        <strong className="text-center text-sm font-black text-slate-950 sm:text-base">
          {formatKoreanMonth(monthValue)}
        </strong>
        <Link href={`/admin/rounds/calendar?month=${nextMonth}`} className={actionLinkClassName()}>
          다음 달
        </Link>
      </nav>

      <section className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-100">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-5">
          <h2 className="font-black text-slate-950">월간 라운드 {typedRounds.length}건</h2>
          <p className="hidden text-xs font-semibold text-slate-400 sm:block">
            날짜별로 묶고, 각 카드의 핵심 작업만 먼저 보여줍니다.
          </p>
        </div>

        {dateKeys.length ? (
          <div className="divide-y divide-slate-100">
            {dateKeys.map((dateKey) => (
              <section key={dateKey} className="px-4 py-4 sm:px-5 lg:py-5">
                <h3 className="mb-3 text-sm font-black text-slate-700">
                  {formatDate(dateKey === 'undated' ? null : dateKey)}
                </h3>

                <div className="space-y-3">
                  {(groupedRounds[dateKey] ?? []).map((round) => {
                    const roundTitle = round.title ?? '라운드';

                    return (
                      <article key={round.id} className="rounded-[1.75rem] border border-slate-100 bg-white p-3 shadow-sm sm:p-4">
                        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_17rem] xl:items-start">
                          <div className="min-w-0 space-y-3">
                            <div className="flex min-w-0 flex-wrap items-center gap-2">
                              <h4 className="min-w-0 truncate text-lg font-black tracking-tight text-slate-950">
                                {roundTitle}
                              </h4>
                              <span
                                className={[
                                  'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-black ring-1',
                                  getStatusClassName(round.status),
                                ].join(' ')}
                              >
                                {getStatusLabel(round.status)}
                              </span>
                            </div>

                            <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                              <div className="rounded-2xl bg-slate-50 px-3 py-2">
                                <dt className="text-[11px] font-bold text-slate-400">골프장</dt>
                                <dd className="mt-1 truncate font-bold text-slate-800">{round.course_name ?? '-'}</dd>
                              </div>
                              <div className="rounded-2xl bg-slate-50 px-3 py-2">
                                <dt className="text-[11px] font-bold text-slate-400">날짜</dt>
                                <dd className="mt-1 font-bold text-slate-800">{formatShortDate(round.play_date)}</dd>
                              </div>
                              <div className="rounded-2xl bg-slate-50 px-3 py-2">
                                <dt className="text-[11px] font-bold text-slate-400">시간</dt>
                                <dd className="mt-1 font-bold text-slate-800">{formatTime(round.start_time)}</dd>
                              </div>
                              <div className="rounded-2xl bg-slate-50 px-3 py-2">
                                <dt className="text-[11px] font-bold text-slate-400">경기/점수</dt>
                                <dd className="mt-1 truncate font-bold text-slate-800">
                                  {getGameTypeLabel(round.game_type)} · {getScoringTypeLabel(round.scoring_type)}
                                </dd>
                              </div>
                            </dl>
                          </div>

                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-2 xl:rounded-3xl xl:bg-slate-50 xl:p-3">
                            <Link href={`/admin/rounds/${round.id}/participants`} className={actionLinkClassName()}>
                              참가자
                            </Link>
                            <Link href={`/admin/rounds/${round.id}/pairings`} className={actionLinkClassName()}>
                              조 편성
                            </Link>
                            <Link href={`/admin/rounds/${round.id}/scores`} className={actionLinkClassName('dark')}>
                              스코어
                            </Link>
                            <Link href={`/admin/rounds/${round.id}/results`} className={actionLinkClassName('green')}>
                              결과
                            </Link>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="px-5 py-12 text-center">
            <p className="font-bold text-slate-700">이 달에 등록된 라운드가 없습니다.</p>
            <p className="mt-1 text-sm text-slate-500">라운드 목록에서 새 라운드를 등록해 주세요.</p>
          </div>
        )}
      </section>
    </main>
  );
}

```


---

## `src/app/(app)/admin/rounds/deleted/page.tsx`

```ts
import Link from 'next/link';
import { ConfirmSubmitButton } from '@/components/confirm-submit-button';
import { requireAdmin } from '@/lib/auth/require-member';
import { adminRestoreRoundAction } from '../actions';

type AdminDeletedRoundsPageProps = {
  searchParams: Promise<{
    roundRestored?: string;
    error?: string;
  }>;
};

type Round = {
  id: string;
  title: string | null;
  course_name: string | null;
  play_date: string | null;
  start_time: string | null;
  memo: string | null;
  status: 'scheduled' | 'completed' | 'cancelled';
  game_type: string | null;
  scoring_type: string | null;
  deleted_at: string | null;
  created_at: string;
};

type RoundParticipant = {
  round_id: string;
};

function getErrorMessage(error?: string) {
  switch (error) {
    case 'auth_required':
      return '로그인이 필요합니다.';
    case 'admin_required':
      return '운영진만 라운드를 관리할 수 있습니다.';
    case 'round_not_found':
      return '라운드를 찾을 수 없습니다.';
    case 'rpc_missing':
      return 'Supabase 라운드 관리 함수가 없습니다. 최신 SQL을 먼저 실행해 주세요.';
    case 'permission_denied':
      return '라운드 관리 권한이 없습니다.';
    case 'unknown':
      return '알 수 없는 오류가 발생했습니다.';
    default:
      return null;
  }
}

function getStatusLabel(status: Round['status']) {
  switch (status) {
    case 'scheduled':
      return '예정';
    case 'completed':
      return '완료';
    case 'cancelled':
      return '취소';
    default:
      return status;
  }
}

function getStatusClassName(status: Round['status']) {
  switch (status) {
    case 'completed':
      return 'bg-blue-100 text-blue-700 ring-blue-200';
    case 'cancelled':
      return 'bg-red-100 text-red-700 ring-red-200';
    default:
      return 'bg-emerald-100 text-emerald-700 ring-emerald-200';
  }
}

function getGameTypeLabel(value?: string | null) {
  switch (value) {
    case 'individual':
      return '개인전';
    case 'foursome':
      return '포섬';
    case 'fourball':
      return '포볼';
    case 'scramble':
      return '스크램블';
    case 'team_match':
      return '청백전';
    default:
      return '미지정';
  }
}

function getScoringTypeLabel(value?: string | null) {
  switch (value) {
    case 'stroke':
      return '스트로크';
    case 'new_peoria':
      return '신페리오';
    case 'match':
    case 'match_play':
      return '매치 플레이';
    case 'stableford':
      return '스테이블포드';
    default:
      return '미지정';
  }
}

function formatDate(value?: string | null) {
  if (!value) {
    return '-';
  }

  return new Date(`${value}T00:00:00`).toLocaleDateString('ko-KR');
}

function formatTime(value?: string | null) {
  if (!value) {
    return '-';
  }

  return value.slice(0, 5);
}

function formatDeletedAt(value?: string | null) {
  if (!value) {
    return '-';
  }

  return new Date(value).toLocaleString('ko-KR');
}

function countParticipantsByRound(participants: RoundParticipant[]) {
  return participants.reduce<Record<string, number>>((acc, participant) => {
    acc[participant.round_id] = (acc[participant.round_id] ?? 0) + 1;
    return acc;
  }, {});
}

function actionLinkClassName(variant: 'default' | 'dark' | 'green' = 'default') {
  if (variant === 'dark') {
    return 'inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-900 px-3 py-2 text-center text-sm font-bold text-white shadow-sm transition hover:bg-slate-800';
  }

  if (variant === 'green') {
    return 'inline-flex min-h-12 items-center justify-center rounded-2xl bg-emerald-600 px-3 py-2 text-center text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700';
  }

  return 'inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-100 px-3 py-2 text-center text-sm font-bold text-slate-700 transition hover:bg-slate-200';
}

export default async function AdminDeletedRoundsPage({
  searchParams,
}: AdminDeletedRoundsPageProps) {
  const params = await searchParams;
  const { supabase, member } = await requireAdmin();

  const { data, error } = await supabase
    .from('rounds')
    .select(
      `
      id,
      title,
      course_name,
      play_date,
      start_time,
      memo,
      status,
      game_type,
      scoring_type,
      deleted_at,
      created_at
    `,
    )
    .eq('club_id', member.club_id)
    .not('deleted_at', 'is', null)
    .order('deleted_at', { ascending: false })
    .order('created_at', { ascending: false });

  if (error && error.code !== '42P01') {
    throw new Error(error.message);
  }

  const rounds = (data ?? []) as Round[];
  const roundIds = rounds.map((round) => round.id);

  const { data: participantsData, error: participantsError } = roundIds.length
    ? await supabase
        .from('round_participants')
        .select('round_id')
        .in('round_id', roundIds)
    : { data: [], error: null };

  if (participantsError && participantsError.code !== '42P01') {
    throw new Error(participantsError.message);
  }

  const participantCounts = countParticipantsByRound(
    (participantsData ?? []) as RoundParticipant[],
  );
  const errorMessage = getErrorMessage(params.error);

  return (
    <main className="mx-auto max-w-7xl space-y-4 px-3 py-4 sm:px-4 sm:py-5 lg:px-6">
      <header className="rounded-[2rem] bg-white/80 p-4 shadow-sm ring-1 ring-slate-100 sm:p-5 lg:flex lg:items-end lg:justify-between lg:gap-6">
        <div className="min-w-0">
          <p className="text-sm font-bold text-amber-600">라운드 안전 관리</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
            삭제된 라운드
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            삭제된 라운드는 기본 목록에서 숨겨집니다. 복구 전까지 일반 운영 작업은 막고, 데이터는 그대로 보존합니다.
          </p>
        </div>

        <nav className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3 lg:mt-0 lg:min-w-[28rem]">
          <Link href="/admin/rounds" className={actionLinkClassName('dark')}>
            라운드 목록
          </Link>
          <Link href="/admin/rounds/calendar" className={actionLinkClassName()}>
            월별 일정
          </Link>
          <Link href="/admin" className={actionLinkClassName()}>
            대시보드
          </Link>
        </nav>
      </header>

      <section className="rounded-3xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
        <p className="font-black">복구 전 확인해 주세요.</p>
        <p className="mt-1">
          복구하면 해당 라운드는 기본 라운드 목록에 다시 표시되고, 참가자/조 편성/스코어/결과 데이터는 그대로 유지됩니다.
        </p>
      </section>

      {params.roundRestored && (
        <section className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
          라운드가 복구되었습니다. 기본 라운드 목록에서 다시 확인할 수 있습니다.
        </section>
      )}

      {errorMessage && (
        <section className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold leading-6 text-red-700">
          {errorMessage}
        </section>
      )}

      <section className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-100">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-5">
          <h2 className="font-black text-slate-950">삭제된 라운드 {rounds.length}개</h2>
          <p className="hidden text-xs font-semibold text-slate-400 sm:block">
            복구 중심으로 단순화했습니다.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {rounds.length ? (
            rounds.map((round) => {
              const participantCount = participantCounts[round.id] ?? 0;
              const roundTitle = round.title ?? '이름 없는 라운드';

              return (
                <article key={round.id} className="px-4 py-4 sm:px-5 lg:py-5">
                  <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_17rem] xl:items-start">
                    <div className="min-w-0 space-y-3">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <h3 className="min-w-0 truncate text-lg font-black tracking-tight text-slate-950 sm:text-xl">
                          {roundTitle}
                        </h3>
                        <span
                          className={[
                            'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-black ring-1',
                            getStatusClassName(round.status),
                          ].join(' ')}
                        >
                          {getStatusLabel(round.status)}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-600">
                          참가자 {participantCount}명
                        </span>
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-black text-amber-700">
                          삭제됨
                        </span>
                      </div>

                      <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3 lg:grid-cols-6">
                        <div className="rounded-2xl bg-slate-50 px-3 py-2">
                          <dt className="text-[11px] font-bold text-slate-400">골프장</dt>
                          <dd className="mt-1 truncate font-bold text-slate-800">{round.course_name ?? '-'}</dd>
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-3 py-2">
                          <dt className="text-[11px] font-bold text-slate-400">날짜</dt>
                          <dd className="mt-1 font-bold text-slate-800">{formatDate(round.play_date)}</dd>
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-3 py-2">
                          <dt className="text-[11px] font-bold text-slate-400">시간</dt>
                          <dd className="mt-1 font-bold text-slate-800">{formatTime(round.start_time)}</dd>
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-3 py-2">
                          <dt className="text-[11px] font-bold text-slate-400">경기</dt>
                          <dd className="mt-1 truncate font-bold text-slate-800">{getGameTypeLabel(round.game_type)}</dd>
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-3 py-2">
                          <dt className="text-[11px] font-bold text-slate-400">점수</dt>
                          <dd className="mt-1 truncate font-bold text-slate-800">{getScoringTypeLabel(round.scoring_type)}</dd>
                        </div>
                        <div className="rounded-2xl bg-amber-50 px-3 py-2">
                          <dt className="text-[11px] font-bold text-amber-500">삭제</dt>
                          <dd className="mt-1 truncate font-bold text-amber-800">{formatDeletedAt(round.deleted_at)}</dd>
                        </div>
                      </dl>

                      {round.memo && (
                        <details className="group rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-600 sm:px-4 sm:py-3">
                          <summary className="cursor-pointer list-none font-bold text-slate-700">
                            <span className="inline-flex items-center gap-2">
                              메모
                              <span className="text-xs text-slate-400 group-open:hidden">펼치기</span>
                              <span className="hidden text-xs text-slate-400 group-open:inline">접기</span>
                            </span>
                          </summary>
                          <p className="mt-2 whitespace-pre-wrap leading-6">{round.memo}</p>
                        </details>
                      )}
                    </div>

                    <div className="space-y-2 xl:rounded-3xl xl:bg-slate-50 xl:p-3">
                      <form action={adminRestoreRoundAction}>
                        <input type="hidden" name="roundId" value={round.id} />
                        <ConfirmSubmitButton
                          confirmMessage={`${roundTitle}를 기본 라운드 목록으로 복구할까요?`}
                          className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700"
                        >
                          라운드 복구
                        </ConfirmSubmitButton>
                      </form>
                      <p className="rounded-2xl bg-white px-3 py-2 text-xs leading-5 text-slate-500 ring-1 ring-slate-100 xl:bg-transparent xl:ring-0">
                        복구 후 일반 운영 화면에서 참가자, 조 편성, 스코어를 다시 관리할 수 있습니다.
                      </p>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="px-5 py-12 text-center">
              <p className="text-sm font-bold text-slate-700">삭제된 라운드가 없습니다.</p>
              <p className="mt-1 text-sm text-slate-500">
                삭제된 라운드가 생기면 이 화면에서 확인하고 복구할 수 있습니다.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

```


---

## `src/app/(app)/admin/rounds/new/page.tsx`

```ts
﻿import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/require-member';
import { createRoundAction } from '../actions';


function getKoreanDateInputValue() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function getKoreanTimeInputValue() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Seoul',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());

  const hour = parts.find((part) => part.type === 'hour')?.value ?? '00';
  const minute = parts.find((part) => part.type === 'minute')?.value ?? '00';

  return `${hour}:${minute}`;
}

type NewRoundPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

function getErrorMessage(error?: string) {
  switch (error) {
    case 'invalid_title':
      return '라운드명을 2자 이상 입력해 주세요.';
    case 'invalid_course_name':
      return '골프장명을 2자 이상 입력해 주세요.';
    case 'invalid_play_date':
      return '라운드 날짜를 입력해 주세요.';
    case 'admin_required':
      return '운영진만 라운드를 생성할 수 있습니다.';
    case 'rpc_missing':
      return 'Supabase 라운드 생성 함수가 없습니다. 0011 SQL을 먼저 실행해 주세요.';
    case 'permission_denied':
      return '라운드 생성 권한이 없습니다.';
    case 'unknown':
      return '알 수 없는 오류가 발생했습니다.';
    default:
      return null;
  }
}

export default async function NewRoundPage({
  searchParams,
}: NewRoundPageProps) {
  const defaultPlayDate = getKoreanDateInputValue();
  const defaultStartTime = getKoreanTimeInputValue();
  await requireAdmin();

  const params = await searchParams;
  const errorMessage = getErrorMessage(params.error);

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl items-center px-4 py-6">
      <section className="w-full rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-emerald-600">
              라운드 관리
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              라운드 생성
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              라운드 기본 정보를 먼저 등록합니다. 참가자 선택과 조 편성은
              다음 단계에서 연결됩니다.
            </p>
          </div>

          <Link
            href="/admin/rounds"
            className="shrink-0 rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700"
          >
            목록
          </Link>
        </div>

        {errorMessage && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
            {errorMessage}
          </div>
        )}

        <form action={createRoundAction} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              라운드명
            </span>
            <input
              name="title"
              type="text"
              required
              minLength={2}
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="예: 6월 정기 라운드"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              골프장
            </span>
            <input
              name="courseName"
              type="text"
              required
              minLength={2}
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="예: 남서울CC"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                날짜
              </span>
              <input
                name="playDate"
                type="date"
                required
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  defaultValue={defaultPlayDate} />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                시작 시간
              </span>
              <input
                name="startTime"
                type="time"
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  defaultValue={defaultStartTime} />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">메모</span>
            <textarea
              name="memo"
              rows={4}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="준비물, 집합 장소, 기타 안내사항"
            />
          </label>

          <button
            type="submit"
            className="h-12 w-full rounded-2xl bg-emerald-600 px-4 font-bold text-white active:scale-[0.99]"
          >
            라운드 생성
          </button>
        </form>
      </section>
    </main>
  );
}

```


---

## `src/app/(app)/admin/rounds/page.tsx`

```ts
import Link from 'next/link';
import { ConfirmSubmitButton } from '@/components/confirm-submit-button';
import { requireAdmin } from '@/lib/auth/require-member';
import { getParkBuddyGameMethodLabel } from '@/lib/round-game-labels';
import { updateRoundStatusAction, duplicateRoundAction, adminSoftDeleteRoundAction } from './actions';

type RoundStatus = 'scheduled' | 'completed' | 'cancelled';
type RoundStatusFilter = 'all' | RoundStatus;

type AdminRoundsPageProps = {
  searchParams: Promise<{ created?: string; statusUpdated?: string; roundDeleted?: string; error?: string; status?: string }>;
};

type Round = {
  id: string;
  title: string | null;
  course_name: string | null;
  play_date: string | null;
  start_time: string | null;
  memo: string | null;
  status: RoundStatus;
  game_type: string | null;
  scoring_type: string | null;
  created_at: string;
};

type RoundParticipant = { round_id: string };

function getErrorMessage(error?: string) {
  switch (error) {
    case 'auth_required': return '로그인이 필요합니다.';
    case 'admin_required': return '운영진만 라운드를 관리할 수 있습니다.';
    case 'invalid_round_status': return '라운드 상태 값이 올바르지 않습니다.';
    case 'round_not_found': return '라운드를 찾을 수 없습니다.';
    case 'rpc_missing': return 'Supabase 라운드 관리 함수가 없습니다. 최신 SQL을 먼저 실행해 주세요.';
    case 'permission_denied': return '라운드 관리 권한이 없습니다.';
    case 'unknown': return '알 수 없는 오류가 발생했습니다.';
    default: return null;
  }
}

function getStatusFilter(value?: string): RoundStatusFilter {
  return value === 'scheduled' || value === 'completed' || value === 'cancelled' ? value : 'all';
}

function getStatusLabel(status: Round['status']) {
  switch (status) {
    case 'scheduled': return '예정';
    case 'completed': return '완료';
    case 'cancelled': return '취소';
    default: return status;
  }
}

function getStatusClassName(status: Round['status']) {
  switch (status) {
    case 'completed': return 'bg-blue-100 text-blue-700';
    case 'cancelled': return 'bg-red-100 text-red-700';
    default: return 'bg-emerald-100 text-emerald-700';
  }
}

function formatDate(value?: string | null) {
  return value ? new Date(value + 'T00:00:00').toLocaleDateString('ko-KR') : '-';
}

function formatTime(value?: string | null) {
  return value ? value.slice(0, 5) : '-';
}

function countParticipantsByRound(participants: RoundParticipant[]) {
  return participants.reduce<Record<string, number>>((acc, participant) => {
    acc[participant.round_id] = (acc[participant.round_id] ?? 0) + 1;
    return acc;
  }, {});
}

function StatusCard({ href, label, value, active }: { href: string; label: string; value: number; active: boolean }) {
  return (
    <Link
      href={href}
      className={[
        'flex min-h-14 flex-col items-center justify-center rounded-2xl border px-2 py-2 text-center shadow-sm transition active:scale-[0.99] md:min-h-16 md:px-3',
        active
          ? 'border-emerald-500 bg-emerald-600 text-white'
          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
      ].join(' ')}
    >
      <p className={['text-[11px] font-extrabold md:text-xs', active ? 'text-emerald-50' : 'text-slate-500'].join(' ')}>{label}</p>
      <p className="mt-0.5 text-lg font-black md:mt-1 md:text-xl">{value}</p>
    </Link>
  );
}

export default async function AdminRoundsPage({ searchParams }: AdminRoundsPageProps) {
  const params = await searchParams;
  const statusFilter = getStatusFilter(params.status);
  const { supabase, member } = await requireAdmin();

  const { data, error } = await supabase
    .from('rounds')
    .select('id, title, course_name, play_date, start_time, memo, status, game_type, scoring_type, created_at')
    .eq('club_id', member.club_id)
    .is('deleted_at', null)
    .order('play_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error && error.code !== '42P01') {
    throw new Error(error.message);
  }

  const rounds = (data ?? []) as Round[];
  const visibleRounds = statusFilter === 'all' ? rounds : rounds.filter((round) => round.status === statusFilter);
  const roundIds = visibleRounds.map((round) => round.id);

  const { data: participantsData, error: participantsError } = roundIds.length
    ? await supabase.from('round_participants').select('round_id').in('round_id', roundIds)
    : { data: [], error: null };

  if (participantsError && participantsError.code !== '42P01') {
    throw new Error(participantsError.message);
  }

  const participantCounts = countParticipantsByRound((participantsData ?? []) as RoundParticipant[]);
  const errorMessage = getErrorMessage(params.error);
  const scheduledCount = rounds.filter((round) => round.status === 'scheduled').length;
  const completedCount = rounds.filter((round) => round.status === 'completed').length;
  const cancelledCount = rounds.filter((round) => round.status === 'cancelled').length;

  return (
    <main className="mx-auto max-w-7xl space-y-4 px-4 py-4 pb-28 md:space-y-5 md:py-6 md:pb-32">
      <header className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm md:border-0 md:bg-transparent md:p-0 md:shadow-none">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-extrabold text-emerald-600 md:text-sm">라운드 관리</p>
            <h1 className="mt-1 text-xl font-black leading-tight text-slate-900 md:text-2xl">라운드 목록</h1>
            <p className="mt-1 text-xs font-semibold leading-5 text-slate-500 md:text-sm">일정, 참가자, 조 편성, 스코어를 빠르게 관리합니다.</p>
          </div>
          <Link href="/admin/rounds/new" className="hidden min-h-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-extrabold text-white shadow-sm transition active:scale-[0.99] sm:flex">
            라운드 생성
          </Link>
        </div>
      </header>

      {params.created && <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 md:p-5">라운드가 생성되었습니다.</section>}
      {params.statusUpdated && <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 md:p-5">라운드 상태가 변경되었습니다.</section>}
      {params.roundDeleted && <section className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800 md:p-5">라운드가 삭제된 라운드 목록으로 이동했습니다.</section>}
      {errorMessage && <section className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700 md:p-5">{errorMessage}</section>}

      <section className="sticky top-0 z-20 -mx-4 border-y border-slate-200 bg-slate-50/95 px-4 py-2 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          <StatusCard href="/admin/rounds" label="전체" value={rounds.length} active={statusFilter === 'all'} />
          <StatusCard href="/admin/rounds?status=scheduled" label="예정" value={scheduledCount} active={statusFilter === 'scheduled'} />
          <StatusCard href="/admin/rounds?status=completed" label="완료" value={completedCount} active={statusFilter === 'completed'} />
          <StatusCard href="/admin/rounds?status=cancelled" label="취소" value={cancelledCount} active={statusFilter === 'cancelled'} />
        </div>
      </section>

      <section className="space-y-3">
        {visibleRounds.length ? (
          visibleRounds.map((round) => {
            const participantCount = participantCounts[round.id] ?? 0;
            return (
              <article key={round.id} className="rounded-[24px] border border-slate-200 bg-white p-3 shadow-sm md:p-4">
                <div className="flex flex-col gap-3 lg:grid lg:grid-cols-[1fr_340px] lg:gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-black leading-tight text-slate-900 md:text-lg">{round.title ?? '이름 없는 라운드'}</h3>
                      <span className={['rounded-full px-2 py-1 text-[11px] font-bold md:text-xs', getStatusClassName(round.status)].join(' ')}>{getStatusLabel(round.status)}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600 md:text-xs">참가자 {participantCount}명</span>
                    </div>

                    <dl className="mt-3 grid grid-cols-2 gap-1.5 text-xs text-slate-600 sm:grid-cols-4 lg:max-w-3xl">
                      <div className="rounded-2xl bg-slate-50 px-3 py-2"><dt className="text-[11px] font-bold text-slate-400">골프장</dt><dd className="mt-0.5 truncate font-bold text-slate-700">{round.course_name ?? '-'}</dd></div>
                      <div className="rounded-2xl bg-slate-50 px-3 py-2"><dt className="text-[11px] font-bold text-slate-400">날짜</dt><dd className="mt-0.5 font-bold text-slate-700">{formatDate(round.play_date)}</dd></div>
                      <div className="rounded-2xl bg-slate-50 px-3 py-2"><dt className="text-[11px] font-bold text-slate-400">시작 시간</dt><dd className="mt-0.5 font-bold text-slate-700">{formatTime(round.start_time)}</dd></div>
                      <div className="rounded-2xl bg-slate-50 px-3 py-2"><dt className="text-[11px] font-bold text-slate-400">경기 방식</dt><dd className="mt-0.5 truncate font-bold text-slate-700">{getParkBuddyGameMethodLabel(round.game_type, round.scoring_type)}</dd></div>
                    </dl>

                    {round.memo && <details className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600"><summary className="cursor-pointer font-semibold text-slate-700">메모 보기</summary><p className="mt-2">{round.memo}</p></details>}
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-4 gap-1.5 lg:grid-cols-2 lg:gap-2">
                      <Link href={'/admin/rounds/' + round.id + '/participants'} className="flex min-h-11 items-center justify-center rounded-2xl bg-slate-100 px-2 py-2 text-center text-xs font-extrabold text-slate-700 transition active:scale-[0.99] md:text-sm">참가자</Link>
                      <Link href={'/admin/rounds/' + round.id + '/pairings'} className="flex min-h-11 items-center justify-center rounded-2xl bg-slate-100 px-2 py-2 text-center text-xs font-extrabold text-slate-700 transition active:scale-[0.99] md:text-sm">조 편성</Link>
                      <Link href={'/admin/rounds/' + round.id + '/scores'} className="flex min-h-11 items-center justify-center rounded-2xl bg-slate-900 px-2 py-2 text-center text-xs font-extrabold text-white transition active:scale-[0.99] md:text-sm">스코어</Link>
                      <Link href={'/admin/rounds/' + round.id + '/results'} className="flex min-h-11 items-center justify-center rounded-2xl bg-emerald-600 px-2 py-2 text-center text-xs font-extrabold text-white transition active:scale-[0.99] md:text-sm">결과</Link>
                    </div>
                    <details className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                      <summary className="cursor-pointer font-semibold">더보기 · 상태 관리</summary>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <Link href={'/admin/rounds/' + round.id + '/edit'} className="rounded-xl bg-white px-3 py-2 text-center font-semibold text-slate-700">수정</Link>
                        <form action={duplicateRoundAction}><input type="hidden" name="roundId" value={round.id} /><button type="submit" className="w-full rounded-xl bg-white px-3 py-2 font-semibold text-slate-700">복제</button></form>
                        {round.status !== 'completed' && <form action={updateRoundStatusAction}><input type="hidden" name="roundId" value={round.id} /><input type="hidden" name="status" value="completed" /><ConfirmSubmitButton confirmMessage={(round.title ?? '이 라운드') + '를 완료 처리할까요?'} className="w-full rounded-xl bg-blue-50 px-3 py-2 font-semibold text-blue-700">완료</ConfirmSubmitButton></form>}
                        {round.status !== 'cancelled' && <form action={updateRoundStatusAction}><input type="hidden" name="roundId" value={round.id} /><input type="hidden" name="status" value="cancelled" /><ConfirmSubmitButton confirmMessage={(round.title ?? '이 라운드') + '를 취소 처리할까요?'} className="w-full rounded-xl bg-red-50 px-3 py-2 font-semibold text-red-700">취소</ConfirmSubmitButton></form>}
                        {round.status !== 'scheduled' && <form action={updateRoundStatusAction} className="col-span-2"><input type="hidden" name="roundId" value={round.id} /><input type="hidden" name="status" value="scheduled" /><ConfirmSubmitButton confirmMessage={(round.title ?? '이 라운드') + '를 예정 상태로 되돌릴까요?'} className="w-full rounded-xl bg-white px-3 py-2 font-semibold text-slate-700">예정으로</ConfirmSubmitButton></form>}
                      </div>
                    </details>
                    <details className="rounded-2xl border border-red-100 bg-red-50/70 px-3 py-2 text-sm text-red-700">
                      <summary className="cursor-pointer font-semibold">위험 작업</summary>
                      <div className="mt-3 space-y-3"><p className="text-xs leading-5 text-red-600">삭제하면 기본 라운드 목록에서 숨겨지며 삭제된 라운드 보기 화면에서 복구할 수 있습니다.</p><form action={adminSoftDeleteRoundAction}><input type="hidden" name="roundId" value={round.id} /><button type="submit" className="w-full rounded-xl border border-red-200 bg-white px-4 py-2 font-semibold text-red-700 shadow-sm transition hover:bg-red-50">삭제 확정</button></form></div>
                    </details>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="rounded-3xl bg-white px-5 py-12 text-center shadow-sm"><p className="text-sm font-semibold text-slate-700">표시할 라운드가 없습니다.</p><p className="mt-1 text-sm text-slate-500">다른 상태를 선택하거나 새 라운드를 생성하세요.</p></div>
        )}
      </section>

      <nav className="parkbuddy-sticky-cta">
        <div data-parkbuddy-sticky-cta="true" className="parkbuddy-sticky-cta__inner">
          <Link href="/admin/rounds/new" className="flex h-12 items-center justify-center rounded-2xl bg-emerald-600 text-sm font-bold text-white shadow-sm">라운드 생성</Link>
        </div>
      </nav>
    </main>
  );
}

```


---

## `src/app/(app)/admin/rounds/status/page.tsx`

```ts
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/require-member';

type StatusPageProps = {
  searchParams?: Promise<{
    status?: string;
  }>;
};

type RoundRow = {
  id: string;
  title: string | null;
  course_name: string | null;
  play_date: string | null;
  start_time: string | null;
  status: 'scheduled' | 'completed' | 'cancelled' | null;
  game_type: string | null;
  scoring_type: string | null;
};

const STATUS_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'scheduled', label: '예정' },
  { value: 'completed', label: '완료' },
  { value: 'cancelled', label: '취소' },
];

function getStatusLabel(value?: string | null) {
  switch (value) {
    case 'scheduled':
      return '예정';
    case 'completed':
      return '완료';
    case 'cancelled':
      return '취소';
    default:
      return '예정';
  }
}

function getStatusClassName(status?: string | null) {
  switch (status) {
    case 'completed':
      return 'bg-blue-100 text-blue-700 ring-blue-200';
    case 'cancelled':
      return 'bg-red-100 text-red-700 ring-red-200';
    default:
      return 'bg-emerald-100 text-emerald-700 ring-emerald-200';
  }
}

function getGameTypeLabel(value?: string | null) {
  switch (value) {
    case 'individual':
      return '개인전';
    case 'foursome':
      return '포섬';
    case 'fourball':
      return '포볼';
    case 'scramble':
      return '스크램블';
    case 'team_match':
      return '청백전';
    default:
      return '미정';
  }
}

function getScoringTypeLabel(value?: string | null) {
  switch (value) {
    case 'stroke':
      return '스트로크';
    case 'new_peoria':
      return '신페리오';
    case 'match':
    case 'match_play':
      return '매치 플레이';
    case 'stableford':
      return '스테이블포드';
    default:
      return '미정';
  }
}

function formatDate(value?: string | null) {
  if (!value) {
    return '-';
  }

  return new Date(`${value}T00:00:00`).toLocaleDateString('ko-KR');
}

function formatTime(value?: string | null) {
  if (!value) {
    return '-';
  }

  return value.slice(0, 5);
}

function normalizeStatus(value?: string) {
  if (value === 'scheduled' || value === 'completed' || value === 'cancelled') {
    return value;
  }

  return 'all';
}

function actionLinkClassName(variant: 'default' | 'dark' | 'green' = 'default') {
  if (variant === 'dark') {
    return 'inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-900 px-3 py-2 text-center text-sm font-bold text-white shadow-sm transition hover:bg-slate-800';
  }

  if (variant === 'green') {
    return 'inline-flex min-h-12 items-center justify-center rounded-2xl bg-emerald-600 px-3 py-2 text-center text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700';
  }

  return 'inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-100 px-3 py-2 text-center text-sm font-bold text-slate-700 transition hover:bg-slate-200';
}

export default async function RoundStatusPage({ searchParams }: StatusPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const selectedStatus = normalizeStatus(resolvedSearchParams.status);
  const { supabase, member } = await requireAdmin();

  let query = supabase
    .from('rounds')
    .select('id, title, course_name, play_date, start_time, status, game_type, scoring_type')
    .eq('club_id', member.club_id)
    .is('deleted_at', null)
    .order('play_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (selectedStatus !== 'all') {
    query = query.eq('status', selectedStatus);
  }

  const { data: rounds, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const typedRounds = (rounds ?? []) as RoundRow[];

  return (
    <main className="mx-auto max-w-7xl space-y-4 px-3 py-4 sm:px-4 sm:py-5 lg:px-6">
      <header className="rounded-[2rem] bg-white/80 p-4 shadow-sm ring-1 ring-slate-100 sm:p-5 lg:flex lg:items-end lg:justify-between lg:gap-6">
        <div className="min-w-0">
          <p className="text-sm font-bold text-emerald-600">라운드 관리</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
            상태별 라운드 보기
          </h1>
        </div>

        <nav className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3 lg:mt-0 lg:min-w-[28rem]">
          <Link href="/admin/rounds" className={actionLinkClassName()}>
            라운드 목록
          </Link>
          <Link href="/admin/rounds/calendar" className={actionLinkClassName()}>
            월별 일정
          </Link>
          <Link href="/admin/rounds/new" className={actionLinkClassName('green')}>
            라운드 생성
          </Link>
        </nav>
      </header>

      <section className="rounded-[2rem] bg-white p-3 shadow-sm ring-1 ring-slate-100">
        <div className="grid grid-cols-4 gap-2">
          {STATUS_OPTIONS.map((option) => {
            const isActive = option.value === selectedStatus;

            return (
              <Link
                key={option.value}
                href={
                  option.value === 'all'
                    ? '/admin/rounds/status'
                    : '/admin/rounds/status?status=' + option.value
                }
                className={
                  isActive
                    ? 'inline-flex min-h-12 items-center justify-center rounded-2xl bg-emerald-600 px-3 py-2 text-center text-sm font-black text-white shadow-sm'
                    : 'inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-100 px-3 py-2 text-center text-sm font-bold text-slate-700 transition hover:bg-slate-200'
                }
              >
                {option.label}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-100">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-5">
          <h2 className="font-black text-slate-950">라운드 {typedRounds.length}건</h2>
        </div>

        <div className="divide-y divide-slate-100">
          {typedRounds.length ? (
            typedRounds.map((round) => {
              const roundTitle = round.title ?? '라운드';

              return (
                <article key={round.id} className="px-4 py-4 sm:px-5 lg:py-5">
                  <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_17rem] xl:items-start">
                    <div className="min-w-0 space-y-3">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <h3 className="min-w-0 truncate text-lg font-black tracking-tight text-slate-950 sm:text-xl">
                          {roundTitle}
                        </h3>
                        <span
                          className={[
                            'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-black ring-1',
                            getStatusClassName(round.status),
                          ].join(' ')}
                        >
                          {getStatusLabel(round.status)}
                        </span>
                      </div>

                      <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3 lg:grid-cols-5">
                        <div className="rounded-2xl bg-slate-50 px-3 py-2">
                          <dt className="text-[11px] font-bold text-slate-400">골프장</dt>
                          <dd className="mt-1 truncate font-bold text-slate-800">{round.course_name ?? '-'}</dd>
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-3 py-2">
                          <dt className="text-[11px] font-bold text-slate-400">날짜</dt>
                          <dd className="mt-1 font-bold text-slate-800">{formatDate(round.play_date)}</dd>
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-3 py-2">
                          <dt className="text-[11px] font-bold text-slate-400">시간</dt>
                          <dd className="mt-1 font-bold text-slate-800">{formatTime(round.start_time)}</dd>
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-3 py-2">
                          <dt className="text-[11px] font-bold text-slate-400">경기</dt>
                          <dd className="mt-1 truncate font-bold text-slate-800">{getGameTypeLabel(round.game_type)}</dd>
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-3 py-2 sm:col-span-2 lg:col-span-1">
                          <dt className="text-[11px] font-bold text-slate-400">점수</dt>
                          <dd className="mt-1 truncate font-bold text-slate-800">{getScoringTypeLabel(round.scoring_type)}</dd>
                        </div>
                      </dl>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-2 xl:rounded-3xl xl:bg-slate-50 xl:p-3">
                      <Link href={`/admin/rounds/${round.id}/participants`} className={actionLinkClassName()}>
                        참가자
                      </Link>
                      <Link href={`/admin/rounds/${round.id}/pairings`} className={actionLinkClassName()}>
                        조 편성
                      </Link>
                      <Link href={`/admin/rounds/${round.id}/scores`} className={actionLinkClassName('dark')}>
                        스코어
                      </Link>
                      <Link href={`/admin/rounds/${round.id}/results`} className={actionLinkClassName('green')}>
                        결과
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="px-5 py-12 text-center">
              <p className="font-bold text-slate-700">조건에 맞는 라운드가 없습니다.</p>
              <p className="mt-1 text-sm text-slate-500">
                다른 상태 필터를 선택하거나 새 라운드를 만들어 주세요.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

```


---

## `src/app/(app)/board/[id]/page.tsx`

```ts
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TopBar } from '@/components/TopBar';
import { formatKoreanDateTime } from '@/lib/utils';
import { requireCurrentMember } from '@/server/auth';

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, member } = await requireCurrentMember();

  const { data: post } = await supabase
    .from('posts')
    .select('id, title, content, post_type, is_private, created_at, author_id, members(name), post_attachments(file_path, content_type)')
    .eq('id', id)
    .eq('club_id', member.club_id)
    .maybeSingle();

  if (!post) notFound();

  const canReadPrivatePost = !post.is_private || post.author_id === member.id || member.role === 'admin';
  if (!canReadPrivatePost) notFound();

  const attachments = post.post_attachments ?? [];
  const signedUrls = await Promise.all(
    attachments.map(async (attachment: { file_path: string }) => {
      const { data } = await supabase.storage.from('post-images').createSignedUrl(attachment.file_path, 60 * 10);
      return data?.signedUrl ?? null;
    })
  );

  return (
    <main className="space-y-5 pb-24">
      <TopBar title="게시글" />
      <article className="rounded-[30px] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {post.post_type === 'notice' ? <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">공지</span> : <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">자유</span>}
            {post.is_private ? <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-bold text-rose-700">비밀글</span> : null}
          </div>
          <time className="text-xs font-medium text-slate-400">{formatKoreanDateTime(post.created_at)}</time>
        </div>

        <h1 className="mt-4 text-2xl font-extrabold leading-tight tracking-[-0.02em] text-slate-950">{post.title}</h1>
        <div className="mt-5 whitespace-pre-wrap rounded-3xl bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700">{post.content}</div>

        {signedUrls.filter(Boolean).length ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {signedUrls.filter(Boolean).map((url) => (
              <Image key={url} src={url as string} alt="게시글 첨부 이미지" width={800} height={600} className="h-auto w-full rounded-2xl object-cover" />
            ))}
          </div>
        ) : null}
      </article>

      <Link href="/board" className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-slate-900 px-4 text-sm font-bold text-white shadow-sm">
        게시판으로 돌아가기
      </Link>
    </main>
  );
}

```


---

## `src/app/(app)/board/new/page.tsx`

```ts
import Link from 'next/link';
import { SubmitButton } from '@/components/SubmitButton';
import { TopBar } from '@/components/TopBar';
import { createPost } from '@/server/actions/posts';
import { requireCurrentMember } from '@/server/auth';

export default async function NewPostPage() {
  const { member } = await requireCurrentMember();

  return (
    <main className="space-y-5 pb-24">
      <TopBar title="글쓰기" />
      <form action={createPost} className="space-y-4 rounded-[30px] bg-white p-5 shadow-sm">
        <label className="block text-sm font-semibold text-slate-700">
          게시판 유형
          <select name="post_type" defaultValue="free" className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="free">자유글</option>
            {member.role === 'admin' ? <option value="notice">공지</option> : null}
          </select>
        </label>
        <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
          <input name="is_private" type="checkbox" className="mt-1 size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
          <span>
            비밀글로 작성
            <span className="mt-1 block text-xs font-normal leading-5 text-slate-500">비밀글은 작성자와 운영진만 서버 권한 검증을 통과해 조회할 수 있습니다.</span>
          </span>
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          제목
          <input name="title" required maxLength={100} className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-emerald-500" />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          내용
          <textarea name="content" required maxLength={5000} rows={8} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          사진 첨부
          <input name="image" type="file" accept="image/jpeg,image/png,image/webp" className="mt-2 block w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
        </label>
        <p className="rounded-2xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">이미지는 5MB 이하의 jpg, png, webp만 허용되며 서버에서 실제 파일 서명을 한 번 더 검사합니다.</p>
        <div className="grid grid-cols-2 gap-2.5">
          <SubmitButton label="게시글 등록" />
          <Link href="/board" className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-100 px-4 text-sm font-bold text-slate-700">
            취소
          </Link>
        </div>
      </form>
    </main>
  );
}

```


---

## `src/app/(app)/board/page.tsx`

```ts
import Link from 'next/link';
import { TopBar } from '@/components/TopBar';
import { EmptyState } from '@/components/EmptyState';
import { formatKoreanDateTime } from '@/lib/utils';
import { requireCurrentMember } from '@/server/auth';

export default async function BoardPage() {
  const { supabase, member } = await requireCurrentMember();

  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, title, content, post_type, is_pinned, is_private, author_id, created_at, members(name)')
    .eq('club_id', member.club_id)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw new Error(error.message);

  const list = posts ?? [];
  const noticeCount = list.filter((post) => post.post_type === 'notice').length;
  const pinnedCount = list.filter((post) => post.is_pinned).length;
  const privateCount = list.filter((post) => post.is_private).length;

  return (
    <main className="space-y-5 pb-24">
      <TopBar title="게시판" action={{ href: '/board/new', label: '글쓰기' }} />

      <section className="grid grid-cols-4 gap-2.5">
        <article className="rounded-3xl bg-emerald-600 px-3 py-3 text-center text-white shadow-sm">
          <p className="text-xs font-semibold">전체</p>
          <p className="mt-1 text-2xl font-extrabold leading-none">{list.length}</p>
        </article>
        <article className="rounded-3xl bg-white px-3 py-3 text-center text-slate-900 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">공지</p>
          <p className="mt-1 text-2xl font-extrabold leading-none">{noticeCount}</p>
        </article>
        <article className="rounded-3xl bg-white px-3 py-3 text-center text-slate-900 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">고정</p>
          <p className="mt-1 text-2xl font-extrabold leading-none">{pinnedCount}</p>
        </article>
        <article className="rounded-3xl bg-white px-3 py-3 text-center text-slate-900 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">비밀</p>
          <p className="mt-1 text-2xl font-extrabold leading-none">{privateCount}</p>
        </article>
      </section>

      {list.length ? (
        <section className="space-y-2.5">
          {list.map((post) => (
            <Link key={post.id} href={`/board/${post.id}`} className="block rounded-[26px] border border-slate-100 bg-white px-4 py-3.5 shadow-sm transition hover:border-emerald-200 hover:shadow-md">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                  {post.post_type === 'notice' ? <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">공지</span> : <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600">자유</span>}
                  {post.is_pinned ? <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700">고정</span> : null}
                  {post.is_private ? <span className="shrink-0 rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-700">비밀</span> : null}
                </div>
                <time className="shrink-0 text-[11px] font-medium text-slate-400">{formatKoreanDateTime(post.created_at)}</time>
              </div>

              <h2 className="mt-2 line-clamp-1 text-base font-bold text-slate-950">{post.title}</h2>
              <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-600">{post.content}</p>
            </Link>
          ))}
        </section>
      ) : (
        <EmptyState title="게시글이 없습니다" />
      )}
    </main>
  );
}

```


---

## `src/app/(app)/layout.tsx`

```ts
import { AppShell } from '@/components/AppShell';
import { requireUser } from '@/server/auth';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  return <AppShell>{children}</AppShell>;
}

```


---

## `src/app/(app)/member-link/page.tsx`

```ts
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

function encodeErrorMessage(message: string) {
  return encodeURIComponent(message.slice(0, 120));
}

function getClaimErrorCode(message?: string) {
  if (!message) {
    return 'unknown';
  }

  if (message.includes('AUTH_REQUIRED')) {
    return 'auth_required';
  }

  if (message.includes('ALREADY_CLAIMED')) {
    return 'already_claimed';
  }

  if (message.includes('INVALID_NAME')) {
    return 'invalid_name';
  }

  if (message.includes('INVALID_PHONE')) {
    return 'invalid_phone';
  }

  if (message.includes('INVALID_CLAIM_CODE')) {
    return 'invalid_code';
  }

  if (message.includes('CLAIM_FAILED')) {
    return 'claim_failed';
  }

  if (message.includes('Could not find the function')) {
    return 'rpc_missing';
  }

  if (message.includes('permission denied')) {
    return 'permission_denied';
  }

  return 'unknown';
}

async function claimMemberAccount(formData: FormData) {
  'use server';

  const supabase = await createClient();

  const name = String(formData.get('name') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const claimCode = String(formData.get('claimCode') ?? '').trim();

  if (name.length < 2) {
    redirect('/member-link?error=invalid_name');
  }

  if (phone.replace(/\D/g, '').length < 8) {
    redirect('/member-link?error=invalid_phone');
  }

  if (claimCode.length < 6) {
    redirect('/member-link?error=invalid_code');
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data, error } = await supabase.rpc('claim_member_account', {
    p_name: name,
    p_phone: phone,
    p_claim_code: claimCode,
  });

  if (error) {
    const errorCode = getClaimErrorCode(error.message);

    console.error('member claim failed', {
      errorCode,
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    redirect(
      `/member-link?error=${errorCode}&debug=${encodeErrorMessage(
        error.message,
      )}`,
    );
  }

  if (!data) {
    redirect('/member-link?error=claim_failed&debug=no_data_returned');
  }

  redirect('/');
}

function getErrorMessage(error?: string) {
  switch (error) {
    case 'invalid_name':
      return '이름을 2자 이상 입력해 주세요.';
    case 'invalid_phone':
      return '연락처를 정확히 입력해 주세요.';
    case 'invalid_code':
      return '연결 코드를 6자리 이상 입력해 주세요.';
    case 'auth_required':
      return '로그인 세션을 확인할 수 없습니다. 다시 로그인해 주세요.';
    case 'already_claimed':
      return '현재 로그인 계정은 이미 다른 회원 정보와 연결되어 있습니다.';
    case 'claim_failed':
      return '일치하는 회원 정보를 찾지 못했습니다. 이름, 연락처, 연결 코드, 코드 만료 여부를 확인해 주세요.';
    case 'rpc_missing':
      return 'Supabase에 회원 연결 함수가 아직 생성되지 않았습니다. 최신 SQL 마이그레이션을 먼저 실행해 주세요.';
    case 'permission_denied':
      return '회원 연결 함수 실행 권한이 없습니다. Supabase RPC 권한 설정을 확인해 주세요.';
    case 'unknown':
      return '회원 연결 중 알 수 없는 오류가 발생했습니다. 아래 개발용 오류 메시지를 확인해 주세요.';
    default:
      return null;
  }
}

export default async function MemberLinkPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; debug?: string }>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: member } = await supabase
    .from('members')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (member) {
    redirect('/');
  }

  const params = await searchParams;
  const errorMessage = getErrorMessage(params.error);
  const debugMessage = params.debug
    ? decodeURIComponent(params.debug)
    : undefined;

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-120px)] max-w-2xl items-center px-4 py-8">
      <section className="w-full rounded-3xl bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-semibold text-emerald-600">ParkBuddy</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            회원 정보 연결
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            운영진이 등록한 회원 정보와 현재 카카오 로그인 계정을 연결합니다.
            이름, 연락처, 연결 코드를 입력해 주세요.
          </p>
        </div>

        {errorMessage && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
            {errorMessage}

            {debugMessage && (
              <p className="mt-2 break-all rounded-xl bg-white/70 px-3 py-2 text-xs text-red-600">
                개발용 오류: {debugMessage}
              </p>
            )}
          </div>
        )}

        <form action={claimMemberAccount} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">이름</span>
            <input
              name="name"
              type="text"
              autoComplete="name"
              required
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="예: 운영자"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">연락처</span>
            <input
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="예: 01012345678"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              연결 코드
            </span>
            <input
              name="claimCode"
              type="password"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="운영진에게 받은 코드"
            />
          </label>

          <button
            type="submit"
            className="h-12 w-full rounded-2xl bg-emerald-600 px-4 font-bold text-white active:scale-[0.99]"
          >
            회원 정보 연결하기
          </button>
        </form>

        <p className="mt-5 text-xs leading-5 text-slate-500">
          연결 코드는 1회만 사용할 수 있습니다. 코드를 모르면 동호회 운영진에게
          문의해 주세요.
        </p>
      </section>
    </main>
  );
}
```


---

## `src/app/(app)/members/page.tsx`

```ts
import { createClient } from '@/lib/supabase/server';
import { PublicMembersList } from '@/components/public-members-list';
import {
  buildOfficialScoreStatsByMember,
  normalizeOfficialScoreRecords,
  type RawRoundScoreRow,
} from '@/lib/score-records';

type Member = {
  id: string;
  name: string;
  phone: string | null;
  handicap: number | null;
  joined_on: string | null;
  role: 'admin' | 'member';
};

export default async function MembersPage() {
  const supabase = await createClient();
  const { data: members, error } = await supabase
    .from('members')
    .select('id, name, phone, handicap, joined_on, role')
    .eq('status', 'active')
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const list = (members ?? []) as Member[];
  const memberIds = list.map((member) => member.id);

  const { data: scoreRows } = memberIds.length
    ? await supabase
        .from('round_scores')
        .select(
          `
          round_id,
          member_id,
          strokes,
          stableford_points,
          memo,
          updated_at,
          round:round_id (
            id,
            title,
            course_name,
            play_date,
            played_on,
            holes,
            deleted_at,
            club_id
          )
        `,
        )
        .in('member_id', memberIds)
    : { data: [] };

  const officialRecords = normalizeOfficialScoreRecords((scoreRows ?? []) as unknown as RawRoundScoreRow[]);
  const statsMap = buildOfficialScoreStatsByMember(officialRecords);

  const adminCount = list.filter((member) => member.role === 'admin').length;
  const memberCount = list.length - adminCount;

  const publicMembers = list.map((member) => {
    const stat = statsMap.get(member.id);

    return {
      ...member,
      roundsCount: stat?.rounds_count ?? 0,
      averageScore: stat?.avg_score ?? null,
      bestScore: stat?.best_score ?? null,
    };
  });

  return (
    <main className="mx-auto max-w-7xl space-y-4 px-4 py-5 pb-28">
      <header>
        <p className="text-sm font-semibold text-emerald-600">회원 목록</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">함께하는 회원</h1>
      </header>

      <section className="grid grid-cols-3 gap-2 sm:gap-2.5">
        <article className="rounded-[28px] border border-slate-200 bg-emerald-600 px-2.5 py-2.5 text-center text-white shadow-sm">
          <p className="text-xs font-semibold">전체</p>
          <p className="mt-1 text-xl font-extrabold leading-none">{list.length}</p>
        </article>
        <article className="rounded-[28px] border border-slate-200 bg-white px-2.5 py-2.5 text-center text-slate-900 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">운영진</p>
          <p className="mt-1 text-xl font-extrabold leading-none">{adminCount}</p>
        </article>
        <article className="rounded-[28px] border border-slate-200 bg-white px-2.5 py-2.5 text-center text-slate-900 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">회원</p>
          <p className="mt-1 text-xl font-extrabold leading-none">{memberCount}</p>
        </article>
      </section>

      <PublicMembersList members={publicMembers} />
    </main>
  );
}

```


---

## `src/app/(app)/mypage/link/page.tsx`

```ts
import { TopBar } from '@/components/TopBar';

export default function LinkMemberPage() {
  return (
    <main className="space-y-5">
      <TopBar title="회원 정보 연결 필요" />
      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">운영진에게 계정 연결을 요청해 주세요</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          보안을 위해 로그인만으로는 동호회 내부 데이터에 접근할 수 없습니다. 운영진이 회원 목록에서 현재 로그인 계정의 user_id를 연결해야 합니다.
        </p>
      </section>
    </main>
  );
}

```


---

## `src/app/(app)/mypage/page.tsx`

```ts
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ScoreTrendChart } from '@/components/ScoreTrendChart';
import { createClient } from '@/lib/supabase/server';
import { formatKoreanPhoneNumber } from '@/lib/korean-search';
import { formatKoreanDate, formatKoreanDateTime } from '@/lib/utils';
import {
  buildOfficialScoreStats,
  getOfficialScoreTrend,
  normalizeOfficialScoreRecords,
  type RawRoundScoreRow,
} from '@/lib/score-records';

type Member = {
  id: string;
  name: string;
  phone: string | null;
  handicap: number | null;
  joined_on: string | null;
  role: 'admin' | 'member';
  club_id: string;
};

type VoteStatus = 'attend' | 'absent' | 'maybe';
type DisplayVoteStatus = 'attend' | 'absent';

type UpcomingEventVote = {
  member_id: string;
  status: VoteStatus;
};

type UpcomingEvent = {
  id: string;
  title: string;
  event_type: string | null;
  starts_at: string;
  course_name: string | null;
  max_participants: number | null;
  event_votes: UpcomingEventVote[] | null;
};

function SummaryCard({ label, value, accent = false }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center shadow-sm">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className={accent ? 'mt-1 text-xl font-extrabold leading-none text-emerald-600' : 'mt-1 text-xl font-extrabold leading-none text-slate-950'}>
        {value}
      </p>
    </article>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-3 py-2.5 text-sm">
      <dt className="shrink-0 text-slate-500">{label}</dt>
      <dd className="min-w-0 text-right font-semibold text-slate-900">{children}</dd>
    </div>
  );
}


function normalizeVoteStatus(status: VoteStatus | null): DisplayVoteStatus | null {
  if (status === 'attend') return 'attend';
  if (status === 'absent') return 'absent';
  return null;
}

function getEventTypeLabel(eventType: string | null) {
  if (eventType === 'tournament') return '대회';
  if (eventType === 'casual') return '번개';
  return '정기 라운딩';
}

function getVoteStatusBadge(status: DisplayVoteStatus | null) {
  if (status === 'attend') {
    return 'bg-emerald-50 text-emerald-700 ring-emerald-100';
  }

  if (status === 'absent') {
    return 'bg-slate-100 text-slate-600 ring-slate-200';
  }

  return 'bg-rose-50 text-rose-700 ring-rose-100';
}

function getVoteStatusLabel(status: DisplayVoteStatus | null) {
  if (status === 'attend') return '참석';
  if (status === 'absent') return '불참';
  return '미선택';
}

function UpcomingScheduleCard({ event, memberId }: { event: UpcomingEvent; memberId: string }) {
  const votes = event.event_votes ?? [];
  const myStatus = normalizeVoteStatus(votes.find((vote) => vote.member_id === memberId)?.status ?? null);
  const attendCount = votes.filter((vote) => vote.status === 'attend').length;
  const absentCount = votes.filter((vote) => vote.status === 'absent').length;
  const votedCount = attendCount + absentCount;
  const total = Math.max(event.max_participants ?? votedCount, votedCount, 1);
  const attendPercent = Math.round((attendCount / total) * 100);

  return (
    <Link href="/schedule" className="block rounded-3xl border border-slate-200 bg-white p-3 shadow-sm transition active:scale-[0.99] md:p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-black text-emerald-600">{getEventTypeLabel(event.event_type)}</p>
          <h3 className="mt-1 truncate text-sm font-extrabold text-slate-950 md:text-base">{event.title}</h3>
          <p className="mt-1 truncate text-xs font-semibold text-slate-500">{formatKoreanDateTime(event.starts_at)}</p>
          <p className="truncate text-xs font-semibold text-slate-500">{event.course_name ?? '장소 미정'}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-black ring-1 ${getVoteStatusBadge(myStatus)}`}>
          {getVoteStatusLabel(myStatus)}
        </span>
      </div>

      <div className="mt-3 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-black text-slate-500">
          <span>참석 {attendCount}명</span>
          <span>투표 {votedCount}명</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(attendPercent, 100)}%` }} aria-hidden="true" />
        </div>
      </div>
    </Link>
  );
}

export default async function MyPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: member } = await supabase
    .from('members')
    .select('id, name, phone, handicap, joined_on, role, club_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!member) {
    redirect('/member-link');
  }

  const currentMember = member as Member;
  const [{ data: scoreRows }, { data: upcomingEvents }] = await Promise.all([
    supabase
      .from('round_scores')
      .select(
        `
        round_id,
        member_id,
        strokes,
        stableford_points,
        memo,
        updated_at,
        round:round_id (
          id,
          title,
          course_name,
          play_date,
          played_on,
          holes,
          deleted_at,
          club_id
        )
      `,
      )
      .eq('member_id', currentMember.id),
    supabase
      .from('events')
      .select('id, title, event_type, starts_at, course_name, max_participants, event_votes(member_id, status)')
      .eq('club_id', currentMember.club_id)
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true })
      .limit(3),
  ]);

  const rounds = normalizeOfficialScoreRecords((scoreRows ?? []) as unknown as RawRoundScoreRow[], currentMember.club_id);
  const scoreStats = buildOfficialScoreStats(rounds);
  const trendData = getOfficialScoreTrend(rounds);
  const upcoming = (upcomingEvents ?? []) as UpcomingEvent[];
  const formattedPhone = formatKoreanPhoneNumber(currentMember.phone);

  return (
    <main className="mx-auto max-w-3xl space-y-5 px-4 py-6 pb-28">
      <header>
        <p className="text-sm font-semibold text-emerald-600">마이페이지</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">내 정보와 기록</h1>
      </header>

      <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-950">{currentMember.name}</h2>
            <p className="mt-1 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
              {currentMember.role === 'admin' ? '운영진' : '회원'}
            </p>
          </div>
          <Link
            href="/mypage/link"
            className="inline-flex min-h-10 items-center justify-center rounded-2xl bg-emerald-600 px-3 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
          >
            계정 연결
          </Link>
        </div>

        <dl className="mt-4 grid gap-2">
          <InfoRow label="연락처">{formattedPhone}</InfoRow>
          <InfoRow label="핸디캡">{currentMember.handicap ?? 0}</InfoRow>
          <InfoRow label="가입일">{currentMember.joined_on ? formatKoreanDate(currentMember.joined_on) : '-'}</InfoRow>
        </dl>
      </section>

      <section className="grid grid-cols-3 gap-2.5">
        <SummaryCard label="라운딩" value={scoreStats.rounds_count} />
        <SummaryCard label="평균" value={scoreStats.avg_score ?? '-'} />
        <SummaryCard label="베스트" value={scoreStats.best_score ?? '-'} accent />
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-slate-50/70 p-3 shadow-sm md:p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-extrabold text-slate-950 md:text-base">다가오는 내 일정</h2>
          </div>
          <Link href="/schedule" className="shrink-0 rounded-full bg-white px-3 py-2 text-xs font-black text-emerald-700 ring-1 ring-emerald-100 active:scale-[0.98]">
            일정 보기
          </Link>
        </div>

        {upcoming.length ? (
          <div className="grid gap-2 md:grid-cols-3">
            {upcoming.map((event) => (
              <UpcomingScheduleCard key={event.id} event={event} memberId={currentMember.id} />
            ))}
          </div>
        ) : (
          <p className="rounded-3xl bg-white px-4 py-5 text-center text-sm font-semibold text-slate-500 shadow-sm ring-1 ring-slate-100">
            예정된 일정이 없습니다.
          </p>
        )}
      </section>

      <ScoreTrendChart data={trendData} />

      <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-slate-950">최근 기록</h2>
          </div>
          <Link href="/scores" className="shrink-0 text-sm font-bold text-emerald-700 underline-offset-4 hover:underline">
            전체 보기
          </Link>
        </div>

        <div className="mt-3 divide-y divide-slate-100">
          {rounds.length ? (
            rounds.map((round) => (
              <Link key={round.round_id} href={`/scores/${round.round_id}`} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {formatKoreanDate(round.play_date ?? round.updated_at ?? '')} · {round.course_name ?? '코스 미정'}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">상세 스코어 보기</p>
                </div>
                <p className="shrink-0 rounded-2xl bg-emerald-50 px-3 py-1.5 text-sm font-extrabold text-emerald-700">
                  {round.total_strokes ?? '-'}타
                </p>
              </Link>
            ))
          ) : (
            <p className="py-5 text-center text-sm text-slate-500">스코어가 없습니다.</p>
          )}
        </div>
      </section>
    </main>
  );
}

```


---

## `src/app/(app)/page.tsx`

```ts
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

type HomeMenuCardProps = {
  href: string;
  eyebrow: string;
  title: string;
  description?: string;
  accent?: 'emerald' | 'slate';
};

function HomeMenuCard({ href, eyebrow, title, description, accent = 'slate' }: HomeMenuCardProps) {
  const isPrimary = accent === 'emerald';

  return (
    <Link
      href={href}
      className={[
        'group rounded-3xl border p-5 shadow-sm transition active:scale-[0.99]',
        isPrimary
          ? 'border-emerald-200 bg-emerald-600 text-white shadow-emerald-900/10'
          : 'border-slate-200 bg-white text-slate-900 shadow-slate-900/5',
      ].join(' ')}
    >
      <p className={isPrimary ? 'text-xs font-bold text-emerald-50' : 'text-xs font-bold text-emerald-600'}>
        {eyebrow}
      </p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight">{title}</h2>
          {description ? (
            <p className={isPrimary ? 'mt-1 text-sm leading-5 text-emerald-50' : 'mt-1 text-sm leading-5 text-slate-500'}>
              {description}
            </p>
          ) : null}
        </div>
        <span
          className={[
            'grid size-10 shrink-0 place-items-center rounded-2xl text-lg font-black transition group-active:translate-x-0.5',
            isPrimary ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-700',
          ].join(' ')}
          aria-hidden
        >
          →
        </span>
      </div>
    </Link>
  );
}

export default async function HomePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: me } = await supabase
    .from('members')
    .select('id, name, role')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!me) {
    redirect('/member-link');
  }

  const isAdmin = me.role === 'admin';

  const { data: events } = await supabase
    .from('events')
    .select('id, title, starts_at, course_name')
    .gte('starts_at', new Date().toISOString())
    .order('starts_at', { ascending: true })
    .limit(1);

  const { data: notices } = await supabase
    .from('posts')
    .select('id, title, created_at')
    .eq('post_type', 'notice')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(1);

  const recentEvent = events?.[0];
  const recentNotice = notices?.[0];

  return (
    <main className="mx-auto max-w-5xl space-y-5 pb-6">
      <header className="space-y-1">
        <p className="text-sm font-bold text-emerald-600">ParkBuddy</p>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
          {me.name}님
        </h1>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <HomeMenuCard
          href={isAdmin ? '/admin/members' : '/members'}
          eyebrow={isAdmin ? '운영진 메뉴' : '회원 메뉴'}
          title="회원 목록"
          accent="emerald"
        />

        {isAdmin ? (
          <>
            <HomeMenuCard
              href="/admin/rounds"
              eyebrow="운영진 메뉴"
              title="라운딩 관리"
            />
            <HomeMenuCard
              href="/admin/logs"
              eyebrow="운영진 메뉴"
              title="작업 관리"
            />
          </>
        ) : (
          <>
            <HomeMenuCard
              href="/schedule"
              eyebrow="회원 메뉴"
              title="일정"
            />
            <HomeMenuCard
              href="/scores"
              eyebrow="회원 메뉴"
              title="스코어"
            />
          </>
        )}
      </section>

      {!isAdmin && (
        <section className="grid gap-3 sm:grid-cols-2">
          <HomeMenuCard
            href="/board"
            eyebrow="소식"
            title="게시판"
          />
          <HomeMenuCard
            href="/mypage"
            eyebrow="내 정보"
            title="마이페이지"
          />
        </section>
      )}

      <section className="grid gap-3 sm:grid-cols-2">
        <HomeMenuCard
          href="/schedule"
          eyebrow="최근 라운딩"
          title={recentEvent?.title ?? '최근 라운딩'}
          description={
            recentEvent
              ? `${new Date(recentEvent.starts_at).toLocaleString('ko-KR')} · ${recentEvent.course_name}`
              : '등록된 일정이 없습니다.'
          }
        />
        <HomeMenuCard
          href="/board"
          eyebrow="게시판"
          title={recentNotice?.title ?? '게시판'}
          description={
            recentNotice
              ? new Date(recentNotice.created_at).toLocaleDateString('ko-KR')
              : '게시글이 없습니다.'
          }
        />
      </section>
    </main>
  );
}

```


---

## `src/app/(app)/schedule/VoteButtons.tsx`

```ts
'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { voteEvent } from '@/server/actions/votes';

type VoteStatus = 'attend' | 'absent';

type ModalMode = VoteStatus | 'all' | null;

export type VoteListMember = {
  id: string;
  name: string;
  status: VoteStatus | null;
};

type VoteButtonsProps = {
  eventId: string;
  currentStatus: VoteStatus | null;
  currentMember: {
    id: string;
    name: string;
  };
  attendVoters: VoteListMember[];
  absentVoters: VoteListMember[];
  totalMembers: number;
};

type VoteTotalButtonProps = {
  voters: VoteListMember[];
  totalMembers: number;
};

const OPTIONS: Array<{ status: VoteStatus; label: string }> = [
  { status: 'attend', label: '참석' },
  { status: 'absent', label: '불참' },
];

function getStatusLabel(status: VoteStatus | null) {
  if (status === 'attend') return '참석';
  if (status === 'absent') return '불참';
  return '미선택';
}

function formatPercent(count: number, totalMembers: number) {
  if (totalMembers <= 0) return 0;
  return Math.round((count / totalMembers) * 100);
}

function mergeOptimisticVoters({
  attendVoters,
  absentVoters,
  currentMember,
  optimisticStatus,
}: {
  attendVoters: VoteListMember[];
  absentVoters: VoteListMember[];
  currentMember: { id: string; name: string };
  optimisticStatus: VoteStatus | null;
}) {
  const normalizedCurrentMember: VoteListMember = {
    id: currentMember.id,
    name: currentMember.name?.trim() || '이름 없음',
    status: optimisticStatus,
  };

  const attend = attendVoters.filter((voter) => voter.id !== currentMember.id);
  const absent = absentVoters.filter((voter) => voter.id !== currentMember.id);

  if (optimisticStatus === 'attend') attend.unshift(normalizedCurrentMember);
  if (optimisticStatus === 'absent') absent.unshift(normalizedCurrentMember);

  return { attend, absent };
}

function VoterListModal({
  mode,
  attendVoters,
  absentVoters,
  onClose,
}: {
  mode: ModalMode;
  attendVoters: VoteListMember[];
  absentVoters: VoteListMember[];
  onClose: () => void;
}) {
  if (!mode) return null;

  const allVoters = [...attendVoters, ...absentVoters];
  const title = mode === 'all' ? '전체 투표 명단' : `${getStatusLabel(mode)} 명단`;
  const voters = mode === 'attend' ? attendVoters : mode === 'absent' ? absentVoters : allVoters;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-3 py-6 backdrop-blur-sm" role="dialog" aria-modal="true">
      <button type="button" aria-label="닫기" className="absolute inset-0 cursor-default" onClick={onClose} />
      <section className="relative w-full max-w-md overflow-hidden rounded-[28px] bg-white shadow-2xl ring-1 ring-slate-200">
        <div className="border-b border-slate-100 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-950">{title}</h3>
              <p className="mt-0.5 text-xs font-bold text-slate-500">총 {voters.length}명</p>
            </div>
            <button type="button" onClick={onClose} className="min-h-11 rounded-2xl bg-slate-100 px-4 text-sm font-extrabold text-slate-700 active:scale-[0.99]">
              닫기
            </button>
          </div>
        </div>

        {voters.length ? (
          <ul className="max-h-[60vh] divide-y divide-slate-100 overflow-y-auto px-4 py-2">
            {voters.map((voter) => (
              <li key={`${voter.id}-${voter.status ?? 'none'}`} className="flex min-h-11 items-center justify-between gap-3 py-2">
                <span className="min-w-0 truncate text-sm font-extrabold text-slate-900">{voter.name}</span>
                {mode === 'all' ? (
                  <span
                    className={
                      'shrink-0 rounded-full px-2.5 py-1 text-[11px] font-black ' +
                      (voter.status === 'attend' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600')
                    }
                  >
                    {getStatusLabel(voter.status)}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 py-8 text-center text-sm font-bold text-slate-500">아직 선택한 회원이 없습니다.</div>
        )}
      </section>
    </div>
  );
}

export function VoteTotalButton({ voters, totalMembers }: VoteTotalButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const percent = formatPercent(voters.length, totalMembers);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-black text-slate-600 ring-1 ring-slate-200 active:scale-[0.98]"
      >
        투표 {voters.length}명 · {percent}%
      </button>
      <VoterListModal
        mode={isOpen ? 'all' : null}
        attendVoters={voters.filter((voter) => voter.status === 'attend')}
        absentVoters={voters.filter((voter) => voter.status === 'absent')}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

export function VoteButtons({ eventId, currentStatus, currentMember, attendVoters, absentVoters, totalMembers }: VoteButtonsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticStatus, setOptimisticStatus] = useState<VoteStatus | null>(currentStatus);
  const [modalMode, setModalMode] = useState<ModalMode>(null);

  const visibleVoters = useMemo(
    () => mergeOptimisticVoters({ attendVoters, absentVoters, currentMember, optimisticStatus }),
    [absentVoters, attendVoters, currentMember, optimisticStatus]
  );

  const handleVote = (status: VoteStatus) => {
    setOptimisticStatus(status);
    setModalMode(status);
    startTransition(async () => {
      await voteEvent({ eventId, status });
      router.refresh();
    });
  };

  return (
    <>
      <div className="space-y-1.5" aria-label="내 참석 선택" role="radiogroup">
        {OPTIONS.map((option) => {
          const isSelected = optimisticStatus === option.status;
          const voters = option.status === 'attend' ? visibleVoters.attend : visibleVoters.absent;
          const count = voters.length;
          const percent = formatPercent(count, totalMembers);

          return (
            <button
              key={option.status}
              type="button"
              disabled={isPending}
              onClick={() => handleVote(option.status)}
              aria-checked={isSelected}
              role="radio"
              className={
                'relative flex min-h-12 w-full overflow-hidden rounded-2xl border bg-white text-left transition active:scale-[0.99] disabled:opacity-60 ' +
                (isSelected ? 'border-emerald-500 shadow-sm ring-2 ring-emerald-100' : 'border-slate-200 hover:bg-slate-50')
              }
            >
              <span className="absolute inset-y-0 left-0 bg-emerald-100/80 transition-all duration-200" style={{ width: `${Math.min(percent, 100)}%` }} aria-hidden="true" />
              <span className="relative z-10 flex min-h-12 w-full items-center gap-2 px-3 py-2">
                <span
                  className={
                    'flex size-5 shrink-0 items-center justify-center rounded-full border bg-white ' +
                    (isSelected ? 'border-emerald-600' : 'border-slate-300')
                  }
                  aria-hidden="true"
                >
                  <span className={isSelected ? 'size-2.5 rounded-full bg-emerald-600' : 'size-2.5 rounded-full bg-transparent'} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-slate-950">{option.label}</span>
                    <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-black text-emerald-700 ring-1 ring-emerald-100">
                      {percent}%
                    </span>
                  </span>
                </span>
                <span className="shrink-0 text-sm font-black text-slate-800">{count}명</span>
              </span>
            </button>
          );
        })}
      </div>
      <VoterListModal
        mode={modalMode}
        attendVoters={visibleVoters.attend}
        absentVoters={visibleVoters.absent}
        onClose={() => setModalMode(null)}
      />
    </>
  );
}

```


---

## `src/app/(app)/schedule/page.tsx`

```ts
import Link from 'next/link';
import { TopBar } from '@/components/TopBar';
import { EmptyState } from '@/components/EmptyState';
import { formatKoreanDateTime } from '@/lib/utils';
import { requireCurrentMember } from '@/server/auth';
import { createRoundFromEventAction } from '@/server/actions/event-rounds';
import { VoteButtons, VoteTotalButton, type VoteListMember } from './VoteButtons';

type VoteStatus = 'attend' | 'absent' | 'maybe';
type DisplayVoteStatus = 'attend' | 'absent';

type EventVote = {
  member_id: string;
  status: VoteStatus;
  member?: {
    name: string | null;
  } | Array<{
    name: string | null;
  }> | null;
};

type EventRow = {
  id: string;
  title: string;
  event_type: string | null;
  starts_at: string;
  course_name: string | null;
  max_participants: number | null;
  memo: string | null;
  event_votes: EventVote[] | null;
};

type LinkedRoundRow = {
  id: string;
  event_id: string | null;
};

type SchedulePageProps = {
  searchParams: Promise<{ eventRoundError?: string }>;
};

type ScheduleSummary = {
  total: number;
  myAttend: number;
  myPending: number;
};

function normalizeVoteStatus(status: VoteStatus | null): DisplayVoteStatus | null {
  if (status === 'attend') return 'attend';
  if (status === 'absent') return 'absent';
  return null;
}

function getEventTypeBadge(eventType: string | null) {
  if (eventType === 'tournament') {
    return { label: '대회', className: 'bg-violet-50 text-violet-700 ring-violet-100' };
  }

  if (eventType === 'casual') {
    return { label: '번개', className: 'bg-amber-50 text-amber-700 ring-amber-100' };
  }

  return { label: '정기 라운딩', className: 'bg-emerald-50 text-emerald-700 ring-emerald-100' };
}

function getEventRoundErrorMessage(error?: string) {
  switch (error) {
    case 'auth_required':
      return '로그인이 필요합니다.';
    case 'admin_required':
      return '운영진만 라운딩을 생성할 수 있습니다.';
    case 'event_not_found':
      return '일정을 찾을 수 없습니다.';
    case 'no_attendees':
      return '참석으로 투표한 회원이 있어야 라운딩을 생성할 수 있습니다.';
    case 'rpc_missing':
      return 'Supabase 라운딩 생성 함수가 없습니다. 최신 SQL을 먼저 실행해 주세요.';
    case 'permission_denied':
      return '라운딩 생성 권한이 없습니다.';
    case 'unknown':
      return '라운딩 생성 중 알 수 없는 오류가 발생했습니다.';
    default:
      return null;
  }
}

function getVoteMemberName(vote: EventVote) {
  const memberRecord = Array.isArray(vote.member) ? vote.member[0] : vote.member;
  return memberRecord?.name?.trim() || '이름 없음';
}

function toVoteListMember(vote: EventVote): VoteListMember {
  return {
    id: vote.member_id,
    name: getVoteMemberName(vote),
    status: normalizeVoteStatus(vote.status),
  };
}

function ScheduleSummaryBar({ summary }: { summary: ScheduleSummary }) {
  return (
    <section className="sticky top-0 z-20 -mx-4 border-y border-slate-200 bg-slate-50/95 px-4 py-2 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
      <div className="grid grid-cols-3 gap-2 md:gap-3">
        <div className="rounded-2xl bg-white px-3 py-2 text-center shadow-sm ring-1 ring-slate-100 md:rounded-3xl md:py-3">
          <p className="text-[11px] font-bold text-slate-400 md:text-xs">예정</p>
          <p className="mt-0.5 text-lg font-extrabold leading-none text-slate-950 md:text-xl">{summary.total}건</p>
        </div>
        <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-center shadow-sm ring-1 ring-emerald-100 md:rounded-3xl md:py-3">
          <p className="text-[11px] font-bold text-emerald-600 md:text-xs">내 참석</p>
          <p className="mt-0.5 text-lg font-extrabold leading-none text-emerald-800 md:text-xl">{summary.myAttend}건</p>
        </div>
        <div className="rounded-2xl bg-rose-50 px-3 py-2 text-center shadow-sm ring-1 ring-rose-100 md:rounded-3xl md:py-3">
          <p className="text-[11px] font-bold text-rose-600 md:text-xs">미선택</p>
          <p className="mt-0.5 text-lg font-extrabold leading-none text-rose-800 md:text-xl">{summary.myPending}건</p>
        </div>
      </div>
    </section>
  );
}

function EventRoundAction({
  eventId,
  linkedRoundId,
  attendCount,
  absentCount,
  totalVotedCount,
  totalMembers,
}: {
  eventId: string;
  linkedRoundId?: string;
  attendCount: number;
  absentCount: number;
  totalVotedCount: number;
  totalMembers: number;
}) {
  const pendingCount = Math.max(totalMembers - totalVotedCount, 0);

  if (linkedRoundId) {
    return (
      <Link
        href={`/admin/rounds/${linkedRoundId}/participants`}
        className="flex min-h-11 items-center justify-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-extrabold text-white shadow-sm transition active:scale-[0.99]"
      >
        생성된 라운딩 보기
      </Link>
    );
  }

  if (attendCount <= 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
        <p className="text-sm font-extrabold text-slate-500">참석자 필요</p>
      </div>
    );
  }

  return (
    <details className="group overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 text-sm font-extrabold text-emerald-800 marker:hidden">
        <span>참석자 기준 라운딩 생성</span>
        <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-black text-emerald-700 ring-1 ring-emerald-100">
          {attendCount}명
        </span>
      </summary>
      <div className="border-t border-emerald-100 bg-white px-3 py-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl bg-emerald-50 px-2 py-2">
            <p className="text-[11px] font-bold text-emerald-600">참가 추가</p>
            <p className="mt-0.5 text-lg font-black leading-none text-emerald-800">{attendCount}</p>
          </div>
          <div className="rounded-2xl bg-rose-50 px-2 py-2">
            <p className="text-[11px] font-bold text-rose-600">불참 제외</p>
            <p className="mt-0.5 text-lg font-black leading-none text-rose-800">{absentCount}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-2 py-2">
            <p className="text-[11px] font-bold text-slate-500">미선택 제외</p>
            <p className="mt-0.5 text-lg font-black leading-none text-slate-800">{pendingCount}</p>
          </div>
        </div>

        <form action={createRoundFromEventAction} className="mt-3">
          <input type="hidden" name="eventId" value={eventId} />
          <button
            type="submit"
            className="flex min-h-11 w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-extrabold text-white shadow-sm transition active:scale-[0.99]"
          >
            확인 후 라운딩 생성
          </button>
        </form>
      </div>
    </details>
  );
}

export default async function SchedulePage({ searchParams }: SchedulePageProps) {
  const params = await searchParams;
  const { supabase, member } = await requireCurrentMember();

  const [{ data, error }, { count: activeMemberCount, error: countError }] = await Promise.all([
    supabase
      .from('events')
      .select('id, title, event_type, starts_at, course_name, max_participants, memo, event_votes(member_id, status, member:members(name))')
      .eq('club_id', member.club_id)
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true }),
    supabase
      .from('members')
      .select('id', { count: 'exact', head: true })
      .eq('club_id', member.club_id)
      .eq('status', 'active'),
  ]);

  if (error) throw new Error(error.message);
  if (countError) throw new Error(countError.message);

  const events = (data ?? []) as EventRow[];
  const eventIds = events.map((event) => event.id);
  const { data: linkedRoundRows, error: linkedRoundsError } = eventIds.length
    ? await supabase
        .from('rounds')
        .select('id, event_id')
        .eq('club_id', member.club_id)
        .in('event_id', eventIds)
    : { data: [], error: null };

  if (linkedRoundsError && linkedRoundsError.code !== '42P01') {
    throw new Error(linkedRoundsError.message);
  }

  const linkedRoundByEventId = new Map(
    ((linkedRoundRows ?? []) as LinkedRoundRow[])
      .filter((round) => round.event_id)
      .map((round) => [round.event_id as string, round.id])
  );
  const totalMembers = Math.max(activeMemberCount ?? 0, 1);
  const eventRoundErrorMessage = getEventRoundErrorMessage(params.eventRoundError);
  const scheduleSummary = events.reduce<ScheduleSummary>(
    (summary, event) => {
      const myStatus = normalizeVoteStatus(event.event_votes?.find((vote) => vote.member_id === member.id)?.status ?? null);

      return {
        total: summary.total + 1,
        myAttend: summary.myAttend + (myStatus === 'attend' ? 1 : 0),
        myPending: summary.myPending + (myStatus ? 0 : 1),
      };
    },
    { total: 0, myAttend: 0, myPending: 0 }
  );

  return (
    <main className="mx-auto max-w-5xl space-y-3 px-4 py-4 pb-28 md:space-y-4 md:py-6">
      <TopBar
        title="일정"
        description="다가오는 라운딩 참석 여부를 빠르게 선택하세요."
        action={member.role === 'admin' ? { href: '/admin/events/new', label: '일정 등록' } : undefined}
      />

      {eventRoundErrorMessage ? (
        <section className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm font-bold leading-6 text-red-700">
          {eventRoundErrorMessage}
        </section>
      ) : null}

      {events.length ? (
        <>
          <ScheduleSummaryBar summary={scheduleSummary} />

          <section className="grid gap-3 lg:grid-cols-2">
            {events.map((event) => {
              const votes = event.event_votes ?? [];
              const attendVoters = votes.filter((vote) => vote.status === 'attend').map(toVoteListMember);
              const absentVoters = votes.filter((vote) => vote.status === 'absent').map(toVoteListMember);
              const allVoters = [...attendVoters, ...absentVoters];
              const myStatus = normalizeVoteStatus(votes.find((vote) => vote.member_id === member.id)?.status ?? null);
              const typeBadge = getEventTypeBadge(event.event_type);
              const linkedRoundId = linkedRoundByEventId.get(event.id);

              return (
                <article key={event.id} className="rounded-[24px] border border-slate-200 bg-white p-3 shadow-sm md:p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-base font-extrabold leading-tight text-slate-950 md:text-lg">{event.title}</h2>
                      <p className="mt-1 text-xs font-semibold leading-5 text-slate-500 md:text-sm">
                        {formatKoreanDateTime(event.starts_at)}
                      </p>
                      <p className="truncate text-xs font-semibold leading-5 text-slate-500 md:text-sm">{event.course_name ?? '-'}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${typeBadge.className}`}>
                        {typeBadge.label}
                      </span>
                      <VoteTotalButton voters={allVoters} totalMembers={totalMembers} />
                    </div>
                  </div>

                  <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-2">
                    <VoteButtons
                      eventId={event.id}
                      currentStatus={myStatus}
                      currentMember={{ id: member.id, name: member.name }}
                      attendVoters={attendVoters}
                      absentVoters={absentVoters}
                      totalMembers={totalMembers}
                    />
                  </div>

                  {member.role === 'admin' ? (
                    <div className="mt-2">
                      <EventRoundAction
                        eventId={event.id}
                        linkedRoundId={linkedRoundId}
                        attendCount={attendVoters.length}
                        absentCount={absentVoters.length}
                        totalVotedCount={allVoters.length}
                        totalMembers={totalMembers}
                      />
                    </div>
                  ) : null}

                  {event.memo ? (
                    <details className="mt-2 rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
                      <summary className="cursor-pointer text-xs font-bold text-slate-500">메모 보기</summary>
                      <p className="mt-1 leading-6">{event.memo}</p>
                    </details>
                  ) : null}
                </article>
              );
            })}
          </section>
        </>
      ) : (
        <EmptyState title="예정된 일정이 없습니다" description="새 라운딩 일정이 등록되면 참석 투표를 할 수 있습니다." />
      )}
    </main>
  );
}

```


---

## `src/app/(app)/scores/[roundId]/ScoreInput.tsx`

```ts
'use client';

import { useMemo, useState } from 'react';
import { saveScore } from '@/server/actions/scores';
import { SubmitButton } from '@/components/SubmitButton';

type HoleScore = {
  hole_no: number;
  par: number;
  strokes: number;
};

export function ScoreInput({
  roundId,
  members,
  holes,
  defaultMemberId,
  canSelectMember,
}: {
  roundId: string;
  members: { id: string; name: string }[];
  holes: number;
  defaultMemberId: string;
  canSelectMember: boolean;
}) {
  const [scores, setScores] = useState<HoleScore[]>(
    Array.from({ length: holes }, (_, index) => ({ hole_no: index + 1, par: 3, strokes: 3 }))
  );

  const total = useMemo(() => scores.reduce((sum, score) => sum + score.strokes, 0), [scores]);

  const updateStrokes = (holeNo: number, strokes: number) => {
    const safeValue = Number.isFinite(strokes) ? Math.min(20, Math.max(1, strokes)) : 3;
    setScores((prev) => prev.map((score) => (score.hole_no === holeNo ? { ...score, strokes: safeValue } : score)));
  };

  return (
    <form action={saveScore} className="space-y-5">
      <input type="hidden" name="roundId" value={roundId} />
      <input type="hidden" name="scores" value={JSON.stringify(scores)} />

      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <label className="block text-sm font-semibold text-slate-700">
          대상 회원
          <select
            name="memberId"
            defaultValue={defaultMemberId}
            disabled={!canSelectMember}
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100"
          >
            {members.map((member) => (
              <option key={member.id} value={member.id}>{member.name}</option>
            ))}
          </select>
        </label>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-900">홀별 스코어</h2>
          <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-emerald-700">합계 <strong>{total}</strong></div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {scores.map((score) => (
            <label key={score.hole_no} className="rounded-2xl border border-slate-200 p-3">
              <span className="text-sm font-semibold text-slate-600">{score.hole_no}H</span>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={20}
                value={score.strokes}
                onChange={(event) => updateStrokes(score.hole_no, Number(event.target.value))}
                className="mt-2 h-12 w-full rounded-xl bg-slate-50 text-center text-lg font-bold outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </label>
          ))}
        </div>
      </section>
      <SubmitButton label="스코어 저장" />
    </form>
  );
}

```


---

## `src/app/(app)/scores/[roundId]/page.tsx`

```ts
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TopBar } from '@/components/TopBar';
import { formatKoreanDate } from '@/lib/utils';
import { requireCurrentMember } from '@/server/auth';

type RoundInfo = {
  id: string;
  title: string | null;
  course_name: string | null;
  play_date: string | null;
  played_on: string | null;
  holes: number | null;
  club_id: string;
  deleted_at: string | null;
};

type RoundScoreRecord = {
  strokes: number | null;
  stableford_points: number | null;
  memo: string | null;
  updated_at: string | null;
};

function getRoundDate(round: RoundInfo) {
  return round.play_date ?? round.played_on;
}

export default async function RoundScorePage({ params }: { params: Promise<{ roundId: string }> }) {
  const { roundId } = await params;
  const { supabase, member } = await requireCurrentMember();

  const { data: round } = await supabase
    .from('rounds')
    .select('id, title, course_name, play_date, played_on, holes, club_id, deleted_at')
    .eq('id', roundId)
    .eq('club_id', member.club_id)
    .is('deleted_at', null)
    .maybeSingle();

  if (!round) notFound();

  const typedRound = round as RoundInfo;

  const { data: score } = await supabase
    .from('round_scores')
    .select('strokes, stableford_points, memo, updated_at')
    .eq('round_id', typedRound.id)
    .eq('member_id', member.id)
    .maybeSingle();

  const typedScore = score as RoundScoreRecord | null;
  const hasScore = typeof typedScore?.strokes === 'number' || typeof typedScore?.stableford_points === 'number';

  return (
    <main className="space-y-5">
      <TopBar
        title={typedRound.title ?? '라운딩'}
        description={`${typedRound.course_name ?? '코스 미정'} · ${typedRound.holes ?? 18}홀`}
      />

      <section className="rounded-3xl bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-extrabold text-slate-950">{typedRound.title ?? '라운딩'}</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              {getRoundDate(typedRound) ? formatKoreanDate(getRoundDate(typedRound) ?? '') : '날짜 미정'} · {typedRound.course_name ?? '코스 미정'}
            </p>
          </div>
        </div>

        {hasScore ? (
          <>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <article className="rounded-3xl bg-emerald-50 p-3 text-center ring-1 ring-emerald-100">
                <p className="text-xs font-black text-emerald-700">총 타수</p>
                <p className="mt-1 text-3xl font-black text-emerald-700">{typedScore?.strokes ?? '-'}</p>
              </article>
              <article className="rounded-3xl bg-slate-50 p-3 text-center ring-1 ring-slate-100">
                <p className="text-xs font-black text-slate-500">스테이블포드</p>
                <p className="mt-1 text-3xl font-black text-slate-950">{typedScore?.stableford_points ?? '-'}</p>
              </article>
            </div>

            {typedScore?.memo ? (
              <div className="mt-4 rounded-3xl bg-slate-50 p-4 text-sm font-semibold text-slate-600">
                {typedScore.memo}
              </div>
            ) : null}
          </>
        ) : (
          <div className="mt-5 rounded-3xl bg-slate-50 px-4 py-6 text-center text-sm font-semibold text-slate-500">
스코어가 없습니다.
          </div>
        )}
      </section>

      <Link
        href="/scores"
        className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-black text-white shadow-sm transition active:scale-[0.99]"
      >
        목록
      </Link>
    </main>
  );
}

```


---

## `src/app/(app)/scores/page.tsx`

```ts
import Link from 'next/link';
import { TopBar } from '@/components/TopBar';
import { StatCard } from '@/components/StatCard';
import { ScoreTrendChart } from '@/components/ScoreTrendChart';
import { formatKoreanDate } from '@/lib/utils';
import {
  buildOfficialScoreStats,
  getOfficialScoreDate,
  getOfficialScoreTrend,
  normalizeOfficialScoreRecords,
  type RawRoundScoreRow,
} from '@/lib/score-records';
import { requireCurrentMember } from '@/server/auth';

export default async function ScoresPage() {
  const { supabase, member } = await requireCurrentMember();

  const { data: scoreRows } = await supabase
    .from('round_scores')
    .select(
      `
      round_id,
      member_id,
      strokes,
      stableford_points,
      memo,
      updated_at,
      round:round_id (
        id,
        title,
        course_name,
        play_date,
        played_on,
        holes,
        deleted_at,
        club_id
      )
    `,
    )
    .eq('member_id', member.id);

  const records = normalizeOfficialScoreRecords((scoreRows ?? []) as unknown as RawRoundScoreRow[], member.club_id);
  const stats = buildOfficialScoreStats(records);
  const trend = getOfficialScoreTrend(records);
  const recentRecords = records.slice(0, 10);

  return (
    <main className="space-y-5">
      <TopBar title="스코어" />

      <section className="grid grid-cols-3 gap-3">
        <StatCard label="라운딩" value={stats.rounds_count} />
        <StatCard label="평균" value={stats.avg_score ?? '-'} />
        <StatCard label="베스트" value={stats.best_score ?? '-'} accent />
      </section>

      <ScoreTrendChart data={trend} />

      <section className="rounded-3xl bg-white p-4 shadow-sm">
        <h2 className="font-bold text-slate-900">최근 기록</h2>
        <div className="mt-3 divide-y divide-slate-100">
          {recentRecords.length ? (
            recentRecords.map((record) => (
              <Link key={record.round_id} href={`/scores/${record.round_id}`} className="block py-2.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">{record.title}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {formatKoreanDate(getOfficialScoreDate(record))} · {record.course_name ?? '코스 미정'} · {record.holes ?? 18}홀
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-base font-extrabold text-emerald-700">{record.total_strokes ?? '-'}타</p>
                    {typeof record.stableford_points === 'number' ? (
                      <p className="mt-0.5 text-xs font-bold text-slate-500">{record.stableford_points}점</p>
                    ) : null}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="py-3 text-sm text-slate-500">스코어가 없습니다.</p>
          )}
        </div>
      </section>
    </main>
  );
}

```


---

## `src/app/(auth)/login/page.tsx`

```ts
import { redirect } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import { KakaoLoginButton } from '@/components/auth/kakao-login-button';
import { createClient } from '@/lib/supabase/server';

function encodeErrorMessage(message: string) {
  return encodeURIComponent(message.slice(0, 120));
}

function getClaimErrorCode(message?: string) {
  if (!message) {
    return 'unknown';
  }

  if (message.includes('AUTH_REQUIRED')) {
    return 'auth_required';
  }

  if (message.includes('ALREADY_CLAIMED')) {
    return 'already_claimed';
  }

  if (message.includes('INVALID_NAME')) {
    return 'invalid_name';
  }

  if (message.includes('INVALID_PHONE')) {
    return 'invalid_phone';
  }

  if (message.includes('INVALID_CLAIM_CODE')) {
    return 'invalid_code';
  }

  if (message.includes('CLAIM_FAILED')) {
    return 'claim_failed';
  }

  if (message.includes('Anonymous sign-ins are disabled')) {
    return 'anonymous_disabled';
  }

  if (message.includes('Could not find the function')) {
    return 'rpc_missing';
  }

  if (message.includes('permission denied')) {
    return 'permission_denied';
  }

  return 'unknown';
}

function getErrorMessage(error?: string) {
  switch (error) {
    case 'invalid_name':
      return '이름을 2자 이상 입력해 주세요.';
    case 'invalid_phone':
      return '연락처를 정확히 입력해 주세요.';
    case 'invalid_code':
      return '초대 코드를 6자리 이상 입력해 주세요.';
    case 'auth_required':
      return '로그인 세션을 만들지 못했습니다. 다시 시도해 주세요.';
    case 'anonymous_disabled':
      return 'Supabase Anonymous sign-in이 아직 켜져 있지 않습니다. 운영자가 Auth 설정을 먼저 확인해야 합니다.';
    case 'already_claimed':
      return '현재 브라우저 세션은 이미 다른 회원과 연결되어 있습니다. 로그아웃 후 다시 시도해 주세요.';
    case 'claim_failed':
      return '일치하는 회원 정보를 찾지 못했습니다. 이름, 연락처, 초대 코드, 코드 만료 여부를 확인해 주세요.';
    case 'rpc_missing':
      return 'Supabase에 회원 연결 함수가 아직 생성되지 않았습니다. 최신 SQL 마이그레이션을 먼저 실행해 주세요.';
    case 'permission_denied':
      return '회원 연결 함수 실행 권한이 없습니다. Supabase RPC 권한 설정을 확인해 주세요.';
    case 'unknown':
      return '초대 코드 로그인 중 알 수 없는 오류가 발생했습니다. 아래 개발용 오류 메시지를 확인해 주세요.';
    default:
      return null;
  }
}

async function startWithInviteCode(formData: FormData) {
  'use server';

  const supabase = await createClient();

  const name = String(formData.get('name') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const claimCode = String(formData.get('claimCode') ?? '').trim();

  if (name.length < 2) {
    redirect('/login?invite=1&error=invalid_name');
  }

  if (phone.replace(/\D/g, '').length < 8) {
    redirect('/login?invite=1&error=invalid_phone');
  }

  if (claimCode.length < 6) {
    redirect('/login?invite=1&error=invalid_code');
  }

  const {
    data: { user: existingUser },
  } = await supabase.auth.getUser();

  if (!existingUser) {
    const { error: signInError } = await supabase.auth.signInAnonymously();

    if (signInError) {
      const errorCode = getClaimErrorCode(signInError.message);

      console.error('anonymous invite sign-in failed', {
        errorCode,
        message: signInError.message,
        status: signInError.status,
      });

      redirect(
        `/login?invite=1&error=${errorCode}&debug=${encodeErrorMessage(
          signInError.message,
        )}`,
      );
    }
  }

  const { data, error } = await supabase.rpc('claim_member_account', {
    p_name: name,
    p_phone: phone,
    p_claim_code: claimCode,
  });

  if (error) {
    const errorCode = getClaimErrorCode(error.message);

    console.error('invite code member claim failed', {
      errorCode,
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    redirect(
      `/login?invite=1&error=${errorCode}&debug=${encodeErrorMessage(
        error.message,
      )}`,
    );
  }

  if (!data) {
    redirect('/login?invite=1&error=claim_failed&debug=no_data_returned');
  }

  redirect('/');
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ invite?: string; error?: string; debug?: string }>;
}) {
  const params = await searchParams;
  const showInviteForm = params.invite === '1' || Boolean(params.error);
  const errorMessage = getErrorMessage(params.error);
  const debugMessage = params.debug
    ? decodeURIComponent(params.debug)
    : undefined;

  return (
    <main className="flex min-h-dvh items-center justify-center bg-slate-50 px-5 py-8">
      <section className="w-full max-w-2xl rounded-3xl bg-white p-5 shadow-sm sm:p-6">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <ShieldCheck aria-hidden />
        </div>
        <p className="mt-5 text-sm font-semibold text-emerald-600">ParkBuddy</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">파크골프 동호회 관리</h1>

        {errorMessage ? (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
            {errorMessage}

            {debugMessage ? (
              <p className="mt-2 break-all rounded-xl bg-white/70 px-3 py-2 text-xs text-red-600">
                개발용 오류: {debugMessage}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-6 space-y-3">
          <KakaoLoginButton />

          <a
            href={showInviteForm ? '/login' : '/login?invite=1'}
            className="flex h-12 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-800 active:scale-[0.99]"
          >
            {showInviteForm ? '초대 코드 닫기' : '초대 코드로 시작하기'}
          </a>
        </div>

        {showInviteForm ? (
          <section className="mt-5 rounded-3xl border border-emerald-100 bg-emerald-50/60 p-4">
            <div>
              <p className="text-sm font-bold text-emerald-700">카카오 로그인이 안 될 때</p>
              <h2 className="mt-1 text-lg font-bold text-slate-900">초대 코드로 첫 접속</h2>
            </div>

            <form action={startWithInviteCode} className="mt-4 space-y-3">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">이름</span>
                <input
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  placeholder="예: 홍길동"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">연락처</span>
                <input
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  placeholder="예: 01012345678"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">초대 코드</span>
                <input
                  name="claimCode"
                  type="password"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  placeholder="운영진에게 받은 코드"
                />
              </label>

              <button
                type="submit"
                className="h-12 w-full rounded-2xl bg-emerald-600 px-4 font-bold text-white active:scale-[0.99]"
              >
                ParkBuddy 시작하기
              </button>
            </form>
          </section>
        ) : null}

        <p className="mt-4 text-xs leading-5 text-slate-500">
          카카오 로그인이 모바일 데이터망에서 실패하면 초대 코드로 시작해 주세요. 초대 코드는 동호회 운영진이 회원 관리 화면에서 발급할 수 있습니다.
        </p>
      </section>
    </main>
  );
}

```


---

## `src/app/auth/callback/route.ts`

```ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(new URL('/login?error=auth', requestUrl));
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL('/login?error=session', requestUrl));
    }

    const { data: member } = await supabase
      .from('members')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!member) {
      return NextResponse.redirect(new URL('/member-link', requestUrl));
    }
  }

  return NextResponse.redirect(new URL('/', requestUrl));
}
```


---

## `src/app/error.tsx`

```ts
'use client';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-slate-50 px-5">
      <section className="w-full max-w-2xl rounded-3xl bg-white p-6 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">오류가 발생했습니다</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">{error.message || '잠시 후 다시 시도해 주세요.'}</p>
        <button onClick={() => reset()} className="mt-6 rounded-2xl bg-emerald-600 px-5 py-3 font-bold text-white">다시 시도</button>
      </section>
    </main>
  );
}

```


---

## `src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: light;
}

* {
  box-sizing: border-box;
}

html {
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
  background: #f8fafc;
  color: #0f172a;
}

button,
a,
input,
select,
textarea {
  -webkit-tap-highlight-color: transparent;
}

input,
select,
textarea {
  font-size: 16px;
}

.safe-bottom {
  padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
}

[data-bottom-nav] {
  padding-left: max(0.5rem, env(safe-area-inset-left));
  padding-right: max(0.5rem, env(safe-area-inset-right));
}


/* ParkBuddy print page: hide app bottom navigation */
body:has([data-parkbuddy-print-page="true"]) [data-bottom-nav],
body:has([data-parkbuddy-print-page="true"]) .fixed.bottom-0,
body:has([data-parkbuddy-print-page="true"]) .fixed.inset-x-0.bottom-0 {
  display: none !important;
}

body:has([data-parkbuddy-print-page="true"]) {
  padding-bottom: 0 !important;
}

@media print {
  nav,
  [data-bottom-nav],
  .fixed.bottom-0,
  .fixed.inset-x-0.bottom-0 {
    display: none !important;
  }

  body {
    padding-bottom: 0 !important;
  }
}

/* ParkBuddy responsive sticky CTA v2 */
@layer components {
  [data-parkbuddy-sticky-cta="true"] {
    width: min(92vw, 36rem) !important;
    min-width: min(92vw, 20rem);
  }

  @media (min-width: 768px) {
    [data-parkbuddy-sticky-cta="true"] {
      width: min(70vw, 38rem) !important;
    }
  }

  [data-parkbuddy-sticky-cta="true"] > * {
    min-width: 0 !important;
    width: 100% !important;
  }

  [data-parkbuddy-sticky-cta="true"] a,
  [data-parkbuddy-sticky-cta="true"] button {
    width: 100% !important;
    min-width: 0 !important;
    min-height: 3.25rem !important;
    border-radius: 1rem !important;
    padding-left: 0.875rem !important;
    padding-right: 0.875rem !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    white-space: nowrap !important;
    font-weight: 800 !important;
  }
}

/* ParkBuddy responsive sticky CTA */
.parkbuddy-sticky-cta {
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom) + 4.75rem);
  z-index: 45;
  display: flex;
  justify-content: center;
  padding: 0 1rem;
  pointer-events: none;
}

.parkbuddy-sticky-cta__inner {
  width: min(92vw, 42rem);
  min-height: 4.25rem;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  align-items: center;
  border: 1px solid rgb(226 232 240);
  border-radius: 1.5rem;
  background: rgba(255, 255, 255, 0.96);
  padding: 0.65rem;
  box-shadow: 0 20px 48px rgba(15, 23, 42, 0.16);
  backdrop-filter: blur(14px);
  pointer-events: auto;
}

.parkbuddy-sticky-cta__inner > a,
.parkbuddy-sticky-cta__inner > button,
.parkbuddy-sticky-cta__inner > form,
.parkbuddy-sticky-cta__inner > form > button {
  min-width: 0;
  width: 100%;
}

.parkbuddy-sticky-cta__inner > a,
.parkbuddy-sticky-cta__inner > button,
.parkbuddy-sticky-cta__inner > form > button {
  min-height: 3rem;
}

@media (min-width: 768px) {
  .parkbuddy-sticky-cta {
    bottom: calc(env(safe-area-inset-bottom) + 5rem);
  }

  .parkbuddy-sticky-cta__inner {
    width: min(72vw, 48rem);
    max-width: 48rem;
  }
}

@media (min-width: 1280px) {
  .parkbuddy-sticky-cta__inner {
    width: min(52vw, 50rem);
    max-width: 50rem;
  }
}
/* End ParkBuddy responsive sticky CTA */

/* ParkBuddy responsive sticky CTA */
.parkbuddy-sticky-cta {
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom) + 4.75rem);
  z-index: 45;
  display: flex;
  justify-content: center;
  padding: 0 1rem;
  pointer-events: none;
}

.parkbuddy-sticky-cta__inner {
  width: min(92vw, 42rem);
  min-height: 4.25rem;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  align-items: stretch;
  border: 1px solid rgb(226 232 240);
  border-radius: 1.5rem;
  background: rgba(255, 255, 255, 0.96);
  padding: 0.65rem;
  box-shadow: 0 20px 48px rgba(15, 23, 42, 0.16);
  backdrop-filter: blur(14px);
  pointer-events: auto;
}

.parkbuddy-sticky-cta__inner > * {
  min-width: 0 !important;
  width: 100% !important;
  max-width: none !important;
}

.parkbuddy-sticky-cta__inner > :only-child {
  grid-column: 1 / -1;
}

.parkbuddy-sticky-cta__inner > a,
.parkbuddy-sticky-cta__inner > button,
.parkbuddy-sticky-cta__inner > form > button {
  width: 100% !important;
  max-width: none !important;
  min-height: 3rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.parkbuddy-sticky-cta__inner > form {
  display: flex;
}

.parkbuddy-sticky-cta__inner > form > button {
  flex: 1 1 auto;
}

@media (max-width: 420px) {
  .parkbuddy-sticky-cta {
    padding: 0 0.75rem;
  }

  .parkbuddy-sticky-cta__inner {
    width: calc(100vw - 1.5rem);
    gap: 0.55rem;
    padding: 0.55rem;
  }
}

@media (min-width: 768px) {
  .parkbuddy-sticky-cta {
    bottom: calc(env(safe-area-inset-bottom) + 5rem);
  }

  .parkbuddy-sticky-cta__inner {
    width: min(72vw, 48rem);
    max-width: 48rem;
  }
}

@media (min-width: 1280px) {
  .parkbuddy-sticky-cta__inner {
    width: min(52vw, 50rem);
    max-width: 50rem;
  }
}
/* End ParkBuddy responsive sticky CTA */

/* ParkBuddy member search layout stability */
html {
  scrollbar-gutter: stable;
}

@supports not (scrollbar-gutter: stable) {
  html {
    overflow-y: scroll;
  }
}

.pb-member-search-results-shell {
  min-height: clamp(30rem, 58dvh, 46rem);
}

.pb-member-search-empty-state {
  min-height: clamp(14rem, 32dvh, 22rem);
}

@media (min-width: 768px) {
  .pb-member-search-results-shell {
    min-height: clamp(34rem, 52dvh, 48rem);
  }
}



/* ParkBuddy mobile dense + soft motion UX foundation */
@layer components {
  .pb-page-motion {
    animation: pb-page-soft-enter 110ms ease-out both;
  }

  .pb-touch-target {
    min-height: 44px;
    min-width: 44px;
  }

  .pb-compact-card {
    border-radius: 1.25rem;
    padding: 0.875rem;
  }

  @media (min-width: 640px) {
    .pb-compact-card {
      border-radius: 1.5rem;
      padding: 1rem;
    }
  }

  @media (min-width: 768px) {
    .pb-page-motion {
      animation: none;
    }
  }
}

@keyframes pb-page-soft-enter {
  from {
    opacity: 0.96;
    transform: translateY(2px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .pb-page-motion {
    animation: none;
  }
}
/* End ParkBuddy mobile dense + soft motion UX foundation */

```


---

## `src/app/layout.tsx`

```ts
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ParkBuddy',
  description: '파크골프 동호회 관리 웹 앱',
  applicationName: 'ParkBuddy',
  appleWebApp: {
    capable: true,
    title: 'ParkBuddy',
  },
  formatDetection: {
    telephone: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#059669',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

```


---

## `src/app/not-found.tsx`

```ts
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-slate-50 px-5">
      <section className="w-full max-w-2xl rounded-3xl bg-white p-6 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">페이지를 찾을 수 없습니다</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">주소가 잘못되었거나 접근 권한이 없을 수 있습니다.</p>
        <Link href="/" className="mt-6 inline-flex rounded-2xl bg-emerald-600 px-5 py-3 font-bold text-white">홈으로 이동</Link>
      </section>
    </main>
  );
}

```


---

## `src/components/AppShell.tsx`

```ts
import { MobileBottomNav } from '@/components/MobileBottomNav';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-slate-50 pb-28 md:pb-28">
      <div className="pb-page-motion mx-auto max-w-7xl px-4 py-5 md:px-6 md:py-8">{children}</div>
      <MobileBottomNav />
    </div>
  );
}

```


---

## `src/components/EmptyState.tsx`

```ts
export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
      <p className="font-semibold text-slate-800">{title}</p>
      {description ? <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p> : null}
    </div>
  );
}

```


---

## `src/components/MobileBottomNav.tsx`

```ts
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileBottomNav() {
  const pathname = usePathname();
  const active = pathname === '/';

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-3 print:hidden safe-bottom">
      <Link
        href="/"
        className={cn(
          'inline-flex min-h-14 min-w-28 flex-col items-center justify-center gap-1 rounded-full border border-slate-200 bg-white/95 px-6 text-[11px] font-semibold shadow-lg shadow-slate-900/10 backdrop-blur transition active:scale-[0.98]',
          active ? 'text-emerald-600' : 'text-slate-600'
        )}
        aria-current={active ? 'page' : undefined}
      >
        <Home size={21} aria-hidden />
        <span>홈</span>
      </Link>
    </nav>
  );
}

```


---

## `src/components/ScoreTrendChart.tsx`

```ts
'use client';

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type ScorePoint = {
  played_on: string;
  total_strokes: number;
};

export function ScoreTrendChart({ data }: { data: ScorePoint[] }) {
  if (data.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-5 text-sm text-slate-500 shadow-sm">
        아직 그래프로 표시할 스코어 기록이 없습니다.
      </div>
    );
  }

  return (
    <div className="h-72 w-full rounded-3xl bg-white p-4 shadow-sm">
      <h2 className="mb-4 font-bold text-slate-900">최근 스코어 추이</h2>
      <ResponsiveContainer width="100%" height="84%">
        <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -18 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="played_on" tickFormatter={(value: string) => value.slice(5)} fontSize={12} />
          <YAxis fontSize={12} allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="total_strokes" strokeWidth={3} dot />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

```


---

## `src/components/StatCard.tsx`

```ts
export function StatCard({ label, value, accent = false }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="rounded-3xl bg-white p-4 text-center shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={accent ? 'mt-1 text-xl font-bold text-emerald-600' : 'mt-1 text-xl font-bold text-slate-900'}>{value}</p>
    </div>
  );
}

```


---

## `src/components/SubmitButton.tsx`

```ts
'use client';

import { useFormStatus } from 'react-dom';

export function SubmitButton({ label = '저장', pendingLabel = '저장 중...' }: { label?: string; pendingLabel?: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="h-13 min-h-12 w-full rounded-2xl bg-emerald-600 px-4 py-3 font-bold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.99]"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

```


---

## `src/components/TopBar.tsx`

```ts
import Link from 'next/link';

export function TopBar({ title, description, action }: { title: string; description?: string; action?: { href: string; label: string } }) {
  return (
    <header className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        {description ? <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p> : null}
      </div>
      {action ? (
        <Link href={action.href} className="shrink-0 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm active:scale-[0.99]">
          {action.label}
        </Link>
      ) : null}
    </header>
  );
}

```


---

## `src/components/admin/deleted-round-operation-blocked.tsx`

```ts
import Link from 'next/link';

type DeletedRoundOperationBlockedProps = {
  roundTitle?: string | null;
};

export function DeletedRoundOperationBlocked({
  roundTitle,
}: DeletedRoundOperationBlockedProps) {
  return (
    <main className="mx-auto max-w-3xl space-y-5 px-4 py-6">
      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
        <p className="text-sm font-semibold text-amber-700">삭제된 라운드</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          {roundTitle ?? '이 라운드'}는 삭제된 라운드입니다.
        </h1>
        <p className="mt-3 text-sm leading-6 text-amber-900">
          삭제된 라운드는 복구 전까지 참가자 선택, 조 편성, 스코어 입력,
          결과 보기, 수정 같은 일반 운영 작업을 할 수 없습니다. 필요한 경우
          삭제된 라운드 화면에서 먼저 복구해 주세요.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Link
            href="/admin/rounds/deleted"
            className="flex h-12 items-center justify-center rounded-2xl bg-amber-600 px-4 text-sm font-bold text-white"
          >
            삭제된 라운드 보기
          </Link>
          <Link
            href="/admin/rounds"
            className="flex h-12 items-center justify-center rounded-2xl bg-white px-4 text-sm font-bold text-slate-700 ring-1 ring-amber-200"
          >
            기본 라운드 목록
          </Link>
        </div>
      </section>
    </main>
  );
}

```


---

## `src/components/admin/linked-event-context-card.tsx`

```ts
import Link from 'next/link';
import type { LinkedEventContext } from '@/lib/round-linked-event-context';

function getEventTypeLabel(eventType: string | null) {
  if (eventType === 'tournament') return '대회';
  if (eventType === 'casual') return '번개';
  return '정기 라운딩';
}

function getEventTypeClassName(eventType: string | null) {
  if (eventType === 'tournament') return 'bg-violet-50 text-violet-700 ring-violet-100';
  if (eventType === 'casual') return 'bg-amber-50 text-amber-700 ring-amber-100';
  return 'bg-emerald-50 text-emerald-700 ring-emerald-100';
}

function formatEventDateTime(value: string | null) {
  if (!value) return '일정 시간 미정';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '일정 시간 미정';

  const dateText = date.toLocaleDateString('ko-KR');
  const timeText = date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${dateText} ${timeText}`;
}

export function LinkedEventContextCard({ context }: { context: LinkedEventContext }) {
  return (
    <section className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-xs font-extrabold uppercase tracking-wide text-emerald-700">연결된 일정</p>
        <span className={['rounded-full px-2.5 py-1 text-xs font-bold ring-1', getEventTypeClassName(context.eventType)].join(' ')}>
          {getEventTypeLabel(context.eventType)}
        </span>
      </div>

      <div className="mt-2 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div>
          <h2 className="truncate text-base font-black text-slate-950">{context.title}</h2>
          <p className="mt-1 text-sm font-medium text-slate-600">
            {formatEventDateTime(context.startsAt)} · {context.courseName || '장소 미정'}
          </p>
          <p className="mt-2 text-sm font-semibold text-emerald-800">
            참석 {context.attendCount}명 · 불참 {context.absentCount}명 · 투표 {context.totalVoteCount}명
          </p>
        </div>

        <Link
          href="/schedule"
          className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-white px-4 py-2 text-sm font-bold text-emerald-700 shadow-sm ring-1 ring-emerald-100 transition hover:bg-emerald-50"
        >
          일정 보기
        </Link>
      </div>
    </section>
  );
}

export function LinkedEventInlineBadge({ context }: { context: LinkedEventContext }) {
  return (
    <div className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
      <p className="font-bold">연결 일정 · {context.title}</p>
      <p className="mt-0.5 text-xs font-semibold text-emerald-700">
        {getEventTypeLabel(context.eventType)} · 참석 {context.attendCount}명 · 불참 {context.absentCount}명
      </p>
    </div>
  );
}

```


---

## `src/components/admin/member-filter-controls.tsx`

```ts
'use client';

import { useRef, useState, useTransition } from 'react';
import { matchesMemberSearch } from '@/lib/korean-search';

type MemberStatusFilter = 'active' | 'inactive';
type MemberViewFilter = 'all' | 'linked' | 'waiting' | 'needs-code';

type FilterCounts = {
  active: Record<MemberViewFilter, number>;
  inactive: Record<MemberViewFilter, number>;
};

type MemberFilterControlsProps = {
  counts: FilterCounts;
  initialStatus?: MemberStatusFilter;
};

const VIEW_ITEMS: MemberViewFilter[] = ['all', 'linked', 'waiting', 'needs-code'];
const VIEW_LABELS: Record<MemberViewFilter, string> = {
  all: '활성 전체',
  linked: '연결 완료',
  waiting: '연결 대기',
  'needs-code': '코드 필요',
};

function getViewLabel(status: MemberStatusFilter, view: MemberViewFilter) {
  if (view !== 'all') {
    return VIEW_LABELS[view];
  }

  return status === 'inactive' ? '비활성 전체' : '활성 전체';
}

function FilterCard({
  label,
  value,
  active,
  onClick,
}: {
  label: string;
  value: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'min-h-[4.25rem] rounded-2xl border px-2 py-2 text-center shadow-sm transition',
        active ? 'border-emerald-500 bg-emerald-600 text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
      ].join(' ')}
    >
      <span className={['block text-[11px] font-bold leading-4', active ? 'text-emerald-50' : 'text-slate-500'].join(' ')}>
        {label}
      </span>
      <span className="mt-1 block text-xl font-black leading-6">{value}</span>
    </button>
  );
}

export function MemberFilterControls({ counts, initialStatus = 'active' }: MemberFilterControlsProps) {
  const [status, setStatus] = useState<MemberStatusFilter>(initialStatus);
  const [view, setView] = useState<MemberViewFilter>('all');
  const [hasQuery, setHasQuery] = useState(false);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const activeCounts = counts[status];
  const helperText = isPending
    ? '검색 중...'
    : '이름 일부, 초성, 자소, 연락처 숫자 한 자리까지 바로 검색됩니다.';


  function applyFilter(nextStatus: MemberStatusFilter, nextView: MemberViewFilter, nextQuery: string) {
    const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-member-card]'));
    const trimmedQuery = nextQuery.trim();

    for (const card of cards) {
      const cardStatus = card.dataset.memberStatus;
      const cardView = card.dataset.memberView;
      const name = card.dataset.memberName ?? '';
      const phone = card.dataset.memberPhone ?? '';
      const statusMatched = cardStatus === nextStatus;
      const viewMatched = nextView === 'all' || cardView === nextView;
      const searchMatched = matchesMemberSearch({ name, phone }, trimmedQuery);
      const visible = statusMatched && viewMatched && searchMatched;

      card.hidden = !visible;
    }
  }
  function clearInput() {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setHasQuery(false);
  }

  function handleViewClick(nextView: MemberViewFilter) {
    startTransition(() => {
      clearInput();
      setView(nextView);
      applyFilter(status, nextView, '');
    });
  }

  function handleStatusClick(nextStatus: MemberStatusFilter) {
    startTransition(() => {
      clearInput();
      setStatus(nextStatus);
      setView('all');
      applyFilter(nextStatus, 'all', '');
    });
  }

  function handleSearch(nextValue: string) {
    startTransition(() => {
      setHasQuery(nextValue.trim().length > 0);
      setView('all');
      applyFilter(status, 'all', nextValue);
    });
  }

  return (
    <>
      <section className="grid grid-cols-4 gap-2">
        {VIEW_ITEMS.map((item) => (
          <FilterCard
            key={item}
            label={getViewLabel(status, item)}
            value={activeCounts[item]}
            active={view === item && !hasQuery}
            onClick={() => handleViewClick(item)}
          />
        ))}
      </section>

      <section className="rounded-3xl bg-white p-3 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleStatusClick('active')}
            className={[
              'h-12 rounded-2xl text-sm font-bold transition',
              status === 'active' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700',
            ].join(' ')}
          >
            활성 회원
          </button>
          <button
            type="button"
            onClick={() => handleStatusClick('inactive')}
            className={[
              'h-12 rounded-2xl text-sm font-bold transition',
              status === 'inactive' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700',
            ].join(' ')}
          >
            비활성 회원
          </button>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-4 shadow-sm">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">회원 검색</span>
          <div className="relative mt-2">
            <input
              ref={inputRef}
              type="search"
              onInput={(event) => handleSearch(event.currentTarget.value)}
              onCompositionUpdate={(event) => handleSearch(event.currentTarget.value)}
              onCompositionEnd={(event) => handleSearch(event.currentTarget.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 pr-10 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="예: 홍, ㅎ, ㅎㅗ, 010, 7"
              autoComplete="off"
              spellCheck={false}
            />
            {hasQuery ? (
              <button
                type="button"
                onClick={() => handleSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400"
                aria-label="검색어 지우기"
              >
                ×
              </button>
            ) : null}
          </div>
        </label>
        <div className="mt-2 flex items-center justify-between gap-3 text-xs text-slate-500">
          <p>{helperText}</p>
        </div>
      </section>
    </>
  );
}

```


---

## `src/components/admin/member-live-search-form.tsx`

```ts
'use client';

import { useMemo, useState, useTransition } from 'react';

type MemberLiveSearchFormProps = {
  defaultValue?: string;
  status?: string;
};

export function MemberLiveSearchForm({ defaultValue = '' }: MemberLiveSearchFormProps) {
  const [value, setValue] = useState(defaultValue);
  const [isPending, startTransition] = useTransition();

  const helperText = useMemo(() => {
    if (isPending) {
      return '검색 중...';
    }

    return '이름 일부, 초성, 자소, 연락처 숫자 한 자리까지 바로 검색됩니다.';
  }, [isPending]);

  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm">
      <label className="block">
        <span className="text-sm font-medium text-slate-700">회원 검색</span>
        <input
          name="q"
          type="search"
          value={value}
          onInput={(event) => {
            const nextValue = event.currentTarget.value;
            startTransition(() => setValue(nextValue));
          }}
          onChange={(event) => {
            const nextValue = event.currentTarget.value;
            startTransition(() => setValue(nextValue));
          }}
          className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          placeholder="예: 홍, ㅎ, ㅎㅗ, 010, 7"
          autoComplete="off"
        />
      </label>
      <p className="mt-2 text-xs text-slate-500">{helperText}</p>
    </div>
  );
}

```


---

## `src/components/admin/participant-selection-enhancer.tsx`

```ts
'use client';

/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useRef, useState } from 'react';

type SyncOptions = {
  query?: string;
  showSelectedOnly?: boolean;
};

function normalizeText(value: string) {
  return value.replace(/\s+/g, ' ').trim().toLowerCase();
}

function getMemberCheckboxes(root: HTMLElement | null) {
  if (!root) {
    return [];
  }

  const form = root.closest('form') ?? document;
  const inputs = Array.from(
    form.querySelectorAll<HTMLInputElement>('input[type="checkbox"]'),
  );

  return inputs.filter((input) => !root.contains(input));
}

function getMemberRow(input: HTMLInputElement) {
  return (
    input.closest<HTMLElement>('[data-member-row]') ??
    input.closest<HTMLElement>('label') ??
    input.closest<HTMLElement>('article') ??
    input.closest<HTMLElement>('li') ??
    input.parentElement?.parentElement ??
    input.parentElement
  );
}

function updateSelectedCountText(selectedCount: number) {
  const countOutputs = Array.from(
    document.querySelectorAll<HTMLElement>('[data-selected-count-output]'),
  );

  for (const element of countOutputs) {
    element.textContent = String(selectedCount);
  }

  const labelOutputs = Array.from(
    document.querySelectorAll<HTMLElement>('[data-selected-count-label]'),
  );

  for (const element of labelOutputs) {
    element.textContent = `${selectedCount}명`;
  }

  const candidates = Array.from(
    document.querySelectorAll<HTMLElement>('p, span, div'),
  );

  for (const element of candidates) {
    const text = element.textContent ?? '';

    if (!text.includes('현재') || !text.includes('명 선택')) {
      continue;
    }

    if (element.querySelector('input, button, a, select, textarea')) {
      continue;
    }

    element.textContent = text.replace(
      /현재\s*\d+\s*명\s*선택됨/g,
      `현재 ${selectedCount}명 선택됨`,
    );
  }
}

export function ParticipantSelectionEnhancer() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState('');
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCount, setSelectedCount] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const [allVisibleSelected, setAllVisibleSelected] = useState(false);

  function sync(options: SyncOptions = {}) {
    const root = rootRef.current;
    const nextQuery = options.query ?? query;
    const nextShowSelectedOnly = options.showSelectedOnly ?? showSelectedOnly;
    const normalizedQuery = normalizeText(nextQuery);
    const checkboxes = getMemberCheckboxes(root);

    let nextSelectedCount = 0;
    let nextVisibleCount = 0;
    let visibleSelectedCount = 0;

    for (const checkbox of checkboxes) {
      const row = getMemberRow(checkbox);

      if (!row) {
        continue;
      }

      const rowText = normalizeText(row.textContent ?? '');
      const matchesQuery = !normalizedQuery || rowText.includes(normalizedQuery);
      const isSelected = checkbox.checked;
      const isVisible = matchesQuery && (!nextShowSelectedOnly || isSelected);

      if (isSelected) {
        nextSelectedCount += 1;
      }

      if (isVisible) {
        nextVisibleCount += 1;

        if (isSelected) {
          visibleSelectedCount += 1;
        }
      }

      row.hidden = !isVisible;
      row.style.display = isVisible ? '' : 'none';
    }

    setTotalCount(checkboxes.length);
    setSelectedCount(nextSelectedCount);
    setVisibleCount(nextVisibleCount);
    setAllVisibleSelected(
      nextVisibleCount > 0 && visibleSelectedCount === nextVisibleCount,
    );
    updateSelectedCountText(nextSelectedCount);
  }

  useEffect(() => {
    const root = rootRef.current;
    const form = root?.closest('form') ?? document;

    function handleChange(event: Event) {
      const target = event.target;

      if (
        target instanceof HTMLInputElement &&
        target.type === 'checkbox' &&
        !root?.contains(target)
      ) {
        window.requestAnimationFrame(() => sync());
      }
    }

    form.addEventListener('change', handleChange);
    const timer = window.setTimeout(() => sync(), 0);

    return () => {
      window.clearTimeout(timer);
      form.removeEventListener('change', handleChange);
    };
  }, []);

  function handleSearchChange(nextQuery: string) {
    setQuery(nextQuery);
    window.requestAnimationFrame(() => sync({ query: nextQuery }));
  }

  function handleSelectedOnlyToggle() {
    const nextValue = !showSelectedOnly;
    setShowSelectedOnly(nextValue);
    window.requestAnimationFrame(() => sync({ showSelectedOnly: nextValue }));
  }

  function handleSelectToggle() {
    const root = rootRef.current;
    const checkboxes = getMemberCheckboxes(root);
    const shouldSelect = !allVisibleSelected;

    for (const checkbox of checkboxes) {
      const row = getMemberRow(checkbox);
      const isVisible = row ? !row.hidden && row.style.display !== 'none' : true;

      if (!isVisible || checkbox.disabled) {
        continue;
      }

      checkbox.checked = shouldSelect;
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    }

    window.requestAnimationFrame(() => sync());
  }

  return (
    <section
      ref={rootRef}
      data-participant-selection-enhancer="true"
      className="sticky top-2 z-20 mb-3 rounded-3xl border border-slate-200/80 bg-white/95 p-3 shadow-sm backdrop-blur sm:static sm:mb-4 sm:p-4"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">회원 검색</h2>
            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
              이름·연락처·역할로 빠르게 찾습니다.
            </p>
          </div>
          <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-right">
            <p className="text-[11px] font-semibold text-emerald-700">선택</p>
            <p className="text-sm font-black text-emerald-900">{selectedCount}명</p>
          </div>
        </div>

        <input
          type="search"
          value={query}
          onChange={(event) => handleSearchChange(event.target.value)}
          placeholder="이름으로 회원 검색"
          className="h-12 w-full rounded-2xl border border-emerald-300 px-4 text-base text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleSelectedOnlyToggle}
            className="min-h-11 rounded-2xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 sm:text-sm"
          >
            {showSelectedOnly ? '전체 보기' : '선택만 보기'}
          </button>

          <button
            type="button"
            onClick={handleSelectToggle}
            className="min-h-11 rounded-2xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white sm:text-sm"
          >
            {allVisibleSelected ? '표시 해제' : '표시 전체 선택'}
          </button>
        </div>

        <p className="text-xs text-slate-500 sm:text-sm">
          전체 {totalCount}명 · 표시 {visibleCount}명 · 선택 {selectedCount}명
        </p>
      </div>
    </section>
  );
}

```


---

## `src/components/admin/round-pairing-form.tsx`

```ts
'use client';

import { useMemo, useState } from 'react';
import {
  getParkBuddyGameRuleDescription,
  normalizeParkBuddyPlayMode,
  normalizeParkBuddyScoringType,
  type ParkBuddyPlayMode,
  type ParkBuddyScoringType,
} from '@/lib/round-game-labels';
import {
  buildParkBuddySmartAssignments,
  getParkBuddyPairingBasisMessage,
  getParkBuddyPlayerSkillScore,
  type ParkBuddyPairingParticipant,
} from '@/lib/round-pairing-algorithm';

type PlayMode = ParkBuddyPlayMode;
type ScoringType = Exclude<ParkBuddyScoringType, 'match_play'>;

type Participant = ParkBuddyPairingParticipant;

type PairingFormProps = {
  roundId: string;
  participants: Participant[];
  defaultPlayMode?: PlayMode | string | null;
  defaultScoringType?: ScoringType | string | null;
  defaultAssignments?: Record<string, number>;
  action: (formData: FormData) => void | Promise<void>;
};

const PLAY_MODE_OPTIONS: Array<{ value: PlayMode; label: string }> = [
  { value: 'individual', label: '개인전' },
  { value: 'foursome', label: '포섬' },
  { value: 'fourball', label: '포볼' },
  { value: 'scramble', label: '스크램블' },
  { value: 'team_match', label: '청백전' },
];

const SCORING_OPTIONS_BY_PLAY_MODE: Record<
  PlayMode,
  Array<{ value: ScoringType; label: string }>
> = {
  individual: [
    { value: 'stroke', label: '스트로크' },
    { value: 'new_peoria', label: '신페리오' },
    { value: 'match', label: '매치' },
    { value: 'stableford', label: '스테이블포드' },
  ],
  foursome: [
    { value: 'stroke', label: '스트로크' },
    { value: 'match', label: '매치' },
  ],
  fourball: [
    { value: 'stroke', label: '스트로크' },
    { value: 'match', label: '매치' },
    { value: 'stableford', label: '스테이블포드' },
  ],
  scramble: [
    { value: 'stroke', label: '스트로크' },
    { value: 'match', label: '매치' },
  ],
  team_match: [
    { value: 'stroke', label: '스트로크' },
    { value: 'new_peoria', label: '신페리오' },
    { value: 'match', label: '매치' },
  ],
};

function normalizePlayMode(value?: string | null): PlayMode {
  return normalizeParkBuddyPlayMode(value);
}

function normalizeScoringType(
  value: string | null | undefined,
  playMode: PlayMode,
): ScoringType {
  const options = SCORING_OPTIONS_BY_PLAY_MODE[playMode];
  const normalizedValue = normalizeParkBuddyScoringType(value);
  const matched = options.find((option) => option.value === normalizedValue);

  return matched?.value ?? options[0]?.value ?? 'stroke';
}

function getRecommendedGroupSizes(totalParticipants: number) {
  if (totalParticipants < 3 || totalParticipants === 5) {
    return [];
  }

  const sizes: number[] = [];
  let remaining = totalParticipants;

  while (remaining > 0) {
    if (remaining === 6) {
      sizes.push(3, 3);
      remaining = 0;
    } else if (remaining === 7) {
      sizes.push(4, 3);
      remaining = 0;
    } else if (remaining === 3 || remaining === 4) {
      sizes.push(remaining);
      remaining = 0;
    } else {
      sizes.push(4);
      remaining -= 4;
    }
  }

  return sizes;
}

function getRecommendedGameSettings(totalParticipants: number): {
  playMode: PlayMode;
  scoringType: ScoringType;
  message: string;
} {
  if (totalParticipants >= 8 && totalParticipants % 2 === 0) {
    return {
      playMode: 'team_match',
      scoringType: 'match',
      message: '청백전 매치를 추천합니다. 팀 대항 방식으로 분위기를 살리기 좋습니다.',
    };
  }

  if (totalParticipants >= 6) {
    return {
      playMode: 'scramble',
      scoringType: 'stroke',
      message: '스크램블 스트로크를 추천합니다. 실력 차이가 있어도 함께 즐기기 좋습니다.',
    };
  }

  return {
    playMode: 'individual',
    scoringType: 'new_peoria',
    message: '개인전 신페리오를 추천합니다. 핸디캡 보정으로 재미를 살릴 수 있습니다.',
  };
}

function getRecommendation(totalParticipants: number) {
  if (totalParticipants < 3) {
    return '참가자가 최소 3명 이상이어야 조 편성이 가능합니다.';
  }

  if (totalParticipants === 5) {
    return '5명은 3명 이상 4명 이하 조로 나누기 어려워 참가자 추가 또는 제외가 필요합니다.';
  }

  return getRecommendedGameSettings(totalParticipants).message;
}

function getSavedAssignmentCounts(
  participants: Participant[],
  assignments?: Record<string, number>,
) {
  return participants.reduce<Record<number, number>>((acc, participant) => {
    const groupIndex = assignments?.[participant.id];

    if (typeof groupIndex !== 'number' || !Number.isFinite(groupIndex) || groupIndex < 0) {
      return acc;
    }

    acc[groupIndex] = (acc[groupIndex] ?? 0) + 1;
    return acc;
  }, {});
}

function hasUsableSavedAssignments(
  participants: Participant[],
  groupSizes: number[],
  defaultAssignments?: Record<string, number>,
) {
  if (!defaultAssignments || Object.keys(defaultAssignments).length === 0) {
    return false;
  }

  if (!groupSizes.length) {
    return false;
  }

  const assignedCount = participants.filter((participant) =>
    typeof defaultAssignments[participant.id] === 'number' &&
    Number.isFinite(defaultAssignments[participant.id]),
  ).length;

  if (assignedCount !== participants.length) {
    return false;
  }

  const counts = getSavedAssignmentCounts(participants, defaultAssignments);

  return Object.entries(counts).every(([groupIndexText, count]) => {
    const groupIndex = Number(groupIndexText);
    const maxSize = groupSizes[groupIndex];
    return typeof maxSize === 'number' && count >= 3 && count <= maxSize;
  });
}

function buildInitialAssignments(
  participants: Participant[],
  groupSizes: number[],
  playMode: PlayMode,
  defaultAssignments?: Record<string, number>,
) {
  if (hasUsableSavedAssignments(participants, groupSizes, defaultAssignments)) {
    return participants.reduce<Record<string, number>>((acc, participant) => {
      acc[participant.id] = defaultAssignments?.[participant.id] ?? 0;
      return acc;
    }, {});
  }

  return buildParkBuddySmartAssignments(participants, groupSizes, playMode);
}

function formatAverage(value?: number | null) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return '평균 -';
  }

  return `평균 ${Math.round(value)}`;
}

export function RoundPairingForm({
  roundId,
  participants,
  defaultPlayMode = null,
  defaultScoringType = null,
  defaultAssignments,
  action,
}: PairingFormProps) {
  const groupSizes = useMemo(
    () => getRecommendedGroupSizes(participants.length),
    [participants.length],
  );

  const hasSavedAssignments = hasUsableSavedAssignments(
    participants,
    groupSizes,
    defaultAssignments,
  );
  const recommendedSettings = getRecommendedGameSettings(participants.length);

  const initialPlayMode = hasSavedAssignments
    ? normalizePlayMode(defaultPlayMode)
    : recommendedSettings.playMode;
  const initialScoringType = hasSavedAssignments
    ? normalizeScoringType(defaultScoringType, initialPlayMode)
    : recommendedSettings.scoringType;

  const [playMode, setPlayMode] = useState<PlayMode>(initialPlayMode);
  const [scoringType, setScoringType] =
    useState<ScoringType>(initialScoringType);
  const [assignments, setAssignments] = useState<Record<string, number>>(() =>
    buildInitialAssignments(participants, groupSizes, initialPlayMode, defaultAssignments),
  );

  const scoringOptions =
    SCORING_OPTIONS_BY_PLAY_MODE[playMode] ?? SCORING_OPTIONS_BY_PLAY_MODE.individual;

  const groupIndexes = groupSizes.map((_, index) => index);
  const recommendation = getRecommendation(participants.length);
  const canSave = groupSizes.length > 0;
  const pairingBasisMessage = groupSizes.length <= 1
    ? '현재 참가 인원은 한 조 편성이 적절합니다.'
    : getParkBuddyPairingBasisMessage(participants, playMode);
  const gameRuleDescription = getParkBuddyGameRuleDescription(playMode, scoringType);

  function applySmartAssignments(nextPlayMode = playMode) {
    setAssignments(buildParkBuddySmartAssignments(participants, groupSizes, nextPlayMode));
  }

  function handleScoringTypeChange(nextValue: string) {
    setScoringType(normalizeScoringType(nextValue, playMode));
    applySmartAssignments(playMode);
  }

  function handlePlayModeChange(nextValue: string) {
    const nextPlayMode = normalizePlayMode(nextValue);
    const nextOptions =
      SCORING_OPTIONS_BY_PLAY_MODE[nextPlayMode] ?? SCORING_OPTIONS_BY_PLAY_MODE.individual;
    const firstOption = nextOptions[0];

    setPlayMode(nextPlayMode);

    if (!nextOptions.some((option) => option.value === scoringType) && firstOption) {
      setScoringType(firstOption.value);
    }

    applySmartAssignments(nextPlayMode);
  }

  const groupCounts = groupIndexes.map(
    (groupIndex) =>
      Object.values(assignments).filter((assignment) => assignment === groupIndex).length,
  );

  return (
    <form action={action} className="space-y-4 pb-24 sm:pb-0">
      <input type="hidden" name="roundId" value={roundId} />
      <input type="hidden" name="playMode" value={playMode} />
      <input type="hidden" name="scoringType" value={scoringType} />
      <input
        type="hidden"
        name="assignments"
        value={JSON.stringify(assignments)}
      />

      <section className="rounded-3xl bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-bold text-slate-900">추천 조합</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              참가자 {participants.length}명 기준: {recommendation}
            </p>
          </div>
          {groupSizes.length > 0 && (
            <div className="shrink-0 rounded-2xl bg-emerald-50 px-3 py-2 text-right text-xs font-bold text-emerald-800">
              {groupSizes.length}개 조
            </div>
          )}
        </div>

        {groupSizes.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-slate-700">
            {groupSizes.map((size, index) => (
              <span key={`${index}-${size}`} className="rounded-full bg-slate-100 px-3 py-1">
                {index + 1}조 {size}명
              </span>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-3xl bg-white p-4 shadow-sm sm:p-5">
        <h2 className="font-bold text-slate-900">경기 방식</h2>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <label className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2">
            <span className="shrink-0 text-sm font-bold text-slate-700">경기 형태</span>
            <select
              value={playMode}
              onChange={(event) => handlePlayModeChange(event.target.value)}
              className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              {PLAY_MODE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2">
            <span className="shrink-0 text-sm font-bold text-slate-700">점수 계산</span>
            <select
              value={scoringType}
              onChange={(event) => handleScoringTypeChange(event.target.value)}
              className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              {scoringOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="mt-3 rounded-2xl bg-emerald-50 px-3 py-2 text-sm leading-6 text-emerald-900">
          {gameRuleDescription}
        </p>
      </section>

      <section className="rounded-3xl bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-bold text-slate-900">조 편성</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {pairingBasisMessage} 필요하면 회원별 조를 직접 바꿀 수 있습니다.
            </p>
          </div>
          <button
            type="button"
            disabled={!groupIndexes.length}
            onClick={() => applySmartAssignments()}
            className="shrink-0 rounded-2xl bg-slate-900 px-3 py-2 text-xs font-bold text-white disabled:bg-slate-300"
          >
            자동 편성
          </button>
        </div>

        {groupIndexes.length ? (
          <>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-slate-700">
              {groupIndexes.map((groupIndex) => (
                <span key={groupIndex} className="rounded-full bg-slate-100 px-3 py-1">
                  {groupIndex + 1}조 {groupCounts[groupIndex] ?? 0}명
                </span>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 md:grid-cols-6 xl:grid-cols-9">
              {participants.map((participant) => (
                <label
                  key={participant.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-2"
                >
                  <span className="block truncate text-xs font-black text-slate-900">
                    {participant.name}
                  </span>

                  <select
                    value={assignments[participant.id] ?? 0}
                    onChange={(event) => {
                      const nextGroupIndex = Number(event.target.value);
                      setAssignments((current) => ({
                        ...current,
                        [participant.id]: nextGroupIndex,
                      }));
                    }}
                    className="mt-1 h-8 w-full rounded-xl border border-slate-200 bg-white px-2 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    {groupIndexes.map((groupIndex) => (
                      <option key={groupIndex} value={groupIndex}>
                        {groupIndex + 1}조
                      </option>
                    ))}
                  </select>

                  <span className="mt-1 block truncate text-[11px] font-medium text-slate-500">
                    {formatAverage(participant.averageStrokes)} · {participant.roundsCount ?? 0}회
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] text-slate-400">
                    실력 {getParkBuddyPlayerSkillScore(participant)}
                  </span>
                </label>
              ))}
            </div>
          </>
        ) : (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
            현재 참가 인원으로는 조 편성이 어렵습니다. 참가자를 조정해 주세요.
          </div>
        )}
      </section>

      <div className="sticky bottom-24 z-20 mx-auto w-full max-w-2xl rounded-3xl border border-white/70 bg-white/95 p-2 shadow-xl backdrop-blur sm:static sm:max-w-none sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-none">
        <button
          type="submit"
          disabled={!canSave}
          className="h-12 w-full rounded-2xl bg-emerald-600 px-4 font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          조 편성 저장 · 참가 {participants.length}명
        </button>
      </div>
    </form>
  );
}

```


---

## `src/components/admin/round-score-input-form.tsx`

```ts
"use client";

import { useMemo, useState } from 'react';
import { saveRoundScoresAction } from '@/app/(app)/admin/rounds/[id]/scores/actions';

type ScoreParticipant = {
  memberId: string;
  name: string;
  handicap: number | null;
  strokes: number | null;
  stablefordPoints: number | null;
  memo: string | null;
};

type RoundScoreInputFormProps = {
  roundId: string;
  participants: ScoreParticipant[];
  playDateLabel: string;
};

type ScoreDraft = {
  strokes: string;
  stablefordPoints: string;
  memo: string;
};

function getEmptyDraft(): ScoreDraft {
  return { strokes: '', stablefordPoints: '', memo: '' };
}

function hasScore(draft: ScoreDraft) {
  return draft.strokes.trim() !== '' || draft.stablefordPoints.trim() !== '';
}

function HiddenScoreInputs({ participant, draft }: { participant: ScoreParticipant; draft: ScoreDraft }) {
  return (
    <div className="hidden" aria-hidden="true">
      <input type="hidden" name="memberId" value={participant.memberId} />
      <input type="hidden" name={`strokes:${participant.memberId}`} value={draft.strokes} />
      <input type="hidden" name={`stablefordPoints:${participant.memberId}`} value={draft.stablefordPoints} />
      <input type="hidden" name={`memo:${participant.memberId}`} value={draft.memo} />
    </div>
  );
}

export function RoundScoreInputForm({ roundId, participants, playDateLabel }: RoundScoreInputFormProps) {
  const [showMissingOnly, setShowMissingOnly] = useState(false);
  const [activeEditingMemberId, setActiveEditingMemberId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, ScoreDraft>>(() =>
    participants.reduce<Record<string, ScoreDraft>>((acc, participant) => {
      acc[participant.memberId] = {
        strokes: participant.strokes == null ? '' : String(participant.strokes),
        stablefordPoints:
          participant.stablefordPoints == null ? '' : String(participant.stablefordPoints),
        memo: participant.memo ?? '',
      };
      return acc;
    }, {}),
  );

  const completedScoreCount = useMemo(
    () => participants.filter((participant) => hasScore(drafts[participant.memberId] ?? getEmptyDraft())).length,
    [drafts, participants],
  );
  const visibleParticipants = useMemo(
    () =>
      showMissingOnly
        ? participants.filter((participant) => !hasScore(drafts[participant.memberId] ?? getEmptyDraft()))
        : participants,
    [drafts, participants, showMissingOnly],
  );

  const hiddenParticipants = useMemo(
    () =>
      showMissingOnly
        ? participants.filter((participant) => hasScore(drafts[participant.memberId] ?? getEmptyDraft()))
        : [],
    [drafts, participants, showMissingOnly],
  );

  function updateDraft(memberId: string, field: keyof ScoreDraft, value: string) {
    setDrafts((current) => ({
      ...current,
      [memberId]: {
        ...(current[memberId] ?? getEmptyDraft()),
        [field]: value,
      },
    }));
  }

  return (
    <form action={saveRoundScoresAction} className="space-y-3 pb-24 sm:space-y-4 sm:pb-0">
      <input type="hidden" name="roundId" value={roundId} />

      <section data-round-detail-mobile-summary className="sticky top-2 z-20 rounded-3xl border border-white/80 bg-white/95 p-2 text-center shadow-sm backdrop-blur md:static md:border-0 md:bg-white md:p-3 md:backdrop-blur-none">
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 sm:grid-cols-4 sm:items-stretch">
          <div className="rounded-2xl bg-slate-50 px-2 py-2.5 sm:py-3">
            <p className="text-xs font-bold text-slate-500">일자</p>
            <p className="mt-1 truncate text-base font-black text-slate-900 sm:text-lg">{playDateLabel}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-2 py-2.5 sm:py-3">
            <p className="text-xs font-bold text-slate-500">참가</p>
            <p className="mt-1 text-base font-black text-slate-900 sm:text-lg">{participants.length}명</p>
          </div>
          <div className="rounded-2xl bg-emerald-50 px-2 py-2.5 sm:py-3">
            <p className="text-xs font-bold text-emerald-700">입력</p>
            <p className="mt-1 text-base font-black text-emerald-900 sm:text-lg">{completedScoreCount}명</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveEditingMemberId(null);
              setShowMissingOnly((current) => !current);
            }}
            disabled={!participants.length}
            aria-pressed={showMissingOnly}
            className={[
              'col-span-3 min-h-11 rounded-2xl px-4 text-sm font-bold shadow-sm transition disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 sm:col-span-1 sm:h-full sm:w-full sm:min-w-0',
              showMissingOnly
                ? 'bg-amber-500 text-white hover:bg-amber-600'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
            ].join(' ')}
          >
            {showMissingOnly ? '전체 보기' : '미입력만 보기'}
          </button>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-3 shadow-sm sm:p-4">
        {hiddenParticipants.map((participant) => (
          <HiddenScoreInputs
            key={`hidden-${participant.memberId}`}
            participant={participant}
            draft={drafts[participant.memberId] ?? getEmptyDraft()}
          />
        ))}

        <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
          {visibleParticipants.length ? (
            visibleParticipants.map((participant) => {
              const draft = drafts[participant.memberId] ?? getEmptyDraft();
              const hasAnyScore = hasScore(draft);

              if (hasAnyScore && participant.memberId !== activeEditingMemberId && !showMissingOnly) {
                return (
                  <article
                    key={participant.memberId}
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveEditingMemberId(participant.memberId)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setActiveEditingMemberId(participant.memberId);
                      }
                    }}
                    className="grid min-h-11 cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-3xl border border-emerald-100 bg-emerald-50/30 px-3 py-2.5 transition hover:border-emerald-200 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-100 sm:px-4 sm:py-3"
                    aria-label={`${participant.name} 스코어 수정하기`}
                  >
                    <HiddenScoreInputs participant={participant} draft={draft} />
                    <div className="min-w-0">
                      <div className="flex min-w-0 items-center gap-2">
                        <p className="truncate font-bold text-slate-900">{participant.name}</p>
                        <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                          입력 완료
                        </span>
                      </div>
                      <p className="mt-1 truncate text-xs font-medium text-slate-500">
                        핸디캡 {participant.handicap ?? 0} · 총 타수 {draft.strokes || '-'} · 포인트 {draft.stablefordPoints || '-'}
                      </p>
                    </div>
                  </article>
                );
              }

              return (
                <article
                  key={participant.memberId}
                  onClick={(event) => {
                    if (!hasAnyScore || participant.memberId !== activeEditingMemberId) {
                      return;
                    }

                    const target = event.target as HTMLElement;
                    if (target.closest('input, label')) {
                      return;
                    }

                    setActiveEditingMemberId(null);
                  }}
                  className={`${hasAnyScore ? 'border-emerald-100 bg-emerald-50/30' : 'border-amber-100 bg-amber-50/30'} grid grid-cols-[minmax(78px,0.9fr)_minmax(62px,0.62fr)_minmax(128px,1.38fr)] items-end gap-2 rounded-3xl border px-3 py-3 sm:grid-cols-[minmax(88px,0.9fr)_minmax(68px,0.62fr)_minmax(142px,1.42fr)] sm:gap-3 sm:px-5 sm:py-4`}
                >
                  <input type="hidden" name="memberId" value={participant.memberId} />
                  <input type="hidden" name={`memo:${participant.memberId}`} value={draft.memo} />

                  <div className="min-w-0 self-center">
                    <p className="truncate font-bold text-slate-900">{participant.name}</p>
                    <div className="mt-1 space-y-1 text-sm text-slate-500">
                      <p>핸디캡 {participant.handicap ?? 0}</p>
                      <span className={hasAnyScore ? 'inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700' : 'inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700'}>
                        {hasAnyScore ? '입력 완료' : '미입력'}
                      </span>
                    </div>
                  </div>

                  <label className="block min-w-0">
                    <span className="block whitespace-nowrap text-[11px] font-medium text-slate-500 sm:text-xs">총 타수</span>
                    <input
                      name={`strokes:${participant.memberId}`}
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={200}
                      value={draft.strokes}
                      onChange={(event) => updateDraft(participant.memberId, 'strokes', event.target.value)}
                      onFocus={() => setActiveEditingMemberId(participant.memberId)}
                      onBlur={() => setActiveEditingMemberId((current) => current === participant.memberId ? null : current)}
                      className="mt-1 h-12 w-full min-w-0 rounded-2xl border border-slate-200 px-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </label>

                  <label className="block min-w-0">
                    <span className="block whitespace-nowrap text-[10px] font-medium text-slate-500 sm:text-[11px]">스테이블포드 포인트</span>
                    <input
                      name={`stablefordPoints:${participant.memberId}`}
                      type="number"
                      inputMode="numeric"
                      min={-20}
                      max={100}
                      value={draft.stablefordPoints}
                      onChange={(event) => updateDraft(participant.memberId, 'stablefordPoints', event.target.value)}
                      onFocus={() => setActiveEditingMemberId(participant.memberId)}
                      onBlur={() => setActiveEditingMemberId((current) => current === participant.memberId ? null : current)}
                      className="mt-1 h-12 w-full min-w-0 rounded-2xl border border-slate-200 px-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </label>
                </article>
              );
            })
          ) : participants.length ? (
            <div className="rounded-3xl border border-slate-100 px-5 py-12 text-center md:col-span-2 2xl:col-span-3">
              <p className="text-sm font-semibold text-slate-700">모든 참가자의 스코어가 입력되었습니다.</p>
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-100 px-5 py-12 text-center md:col-span-2 2xl:col-span-3">
              <p className="text-sm font-semibold text-slate-700">참가자가 없습니다.</p>
            </div>
          )}
        </div>
      </section>

      <div className="sticky bottom-24 z-20 mx-auto w-full max-w-2xl rounded-3xl border border-white/70 bg-white/95 p-2 shadow-xl backdrop-blur sm:static sm:max-w-none sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-none">
        <button
          type="submit"
          disabled={!participants.length}
          className="h-12 w-full rounded-2xl bg-emerald-600 px-4 font-bold text-white shadow-sm disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          저장 · 완료 {completedScoreCount}/{participants.length}
        </button>
      </div>
    </form>
  );
}

```


---

## `src/components/auth/kakao-login-button.tsx`

```ts
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

function getKakaoCallbackUrl() {
  if (typeof window === 'undefined') {
    return null;
  }

  const callbackUrl = new URL('/auth/callback', window.location.origin);

  if (callbackUrl.protocol !== 'http:' && callbackUrl.protocol !== 'https:') {
    return null;
  }

  return callbackUrl.toString();
}

export function KakaoLoginButton() {
  const [isLoading, setIsLoading] = useState(false);

  const loginWithKakao = async () => {
    if (isLoading) {
      return;
    }

    const redirectTo = getKakaoCallbackUrl();

    if (!redirectTo) {
      alert('로그인 주소를 확인하지 못했습니다. 브라우저를 새로고침한 뒤 다시 시도해 주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo,
          scopes: 'profile_nickname profile_image',
          queryParams: {
            prompt: 'select_account',
          },
        },
      });

      if (error) {
        throw error;
      }

      // Supabase normally performs the redirect automatically, but assigning the
      // returned URL explicitly keeps the OAuth flow stable across browsers.
      if (data.url) {
        window.location.assign(data.url);
      }
    } catch {
      setIsLoading(false);
      alert('로그인 요청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  return (
    <button
      type="button"
      onClick={loginWithKakao}
      disabled={isLoading}
      className="h-12 w-full rounded-2xl bg-yellow-300 font-bold text-slate-950 shadow-sm transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isLoading ? '카카오로 이동 중...' : '카카오로 시작하기'}
    </button>
  );
}

```


---

## `src/components/confirm-submit-button.tsx`

```ts
'use client';

type ConfirmSubmitButtonProps = {
  confirmMessage: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * Server Action form 안에서 사용하는 확인 버튼입니다.
 *
 * 핵심 로직:
 * - 취소를 누르면 form 제출을 막습니다.
 * - 확인을 누르면 브라우저의 기본 form 제출 흐름을 그대로 둡니다.
 */
export function ConfirmSubmitButton({
  confirmMessage,
  children,
  className,
}: ConfirmSubmitButtonProps) {
  return (
    <button
      type="submit"
      onClick={(event) => {
        const confirmed = window.confirm(confirmMessage);

        if (!confirmed) {
          event.preventDefault();
        }
      }}
      className={
        className ??
        'rounded-2xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-700'
      }
    >
      {children}
    </button>
  );
}

```


---

## `src/components/copy-button.tsx`

```ts
'use client';

import { useState } from 'react';

type CopyButtonProps = {
  value?: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
};

export function CopyButton({
  value,
  label = '복사',
  copiedLabel = '복사됨',
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!value) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setCopied(false);
      window.alert('복사에 실패했습니다. 연결 코드를 직접 선택해 복사해 주세요.');
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!value}
      className={
        className ??
        'rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300'
      }
    >
      {copied ? copiedLabel : label}
    </button>
  );
}

```


---

## `src/components/copy-current-url-button.tsx`

```ts
'use client';

import { useState } from 'react';

type CopyCurrentUrlButtonProps = {
  label?: string;
  copiedLabel?: string;
};

export function CopyCurrentUrlButton({
  label = '링크 복사',
  copiedLabel = '복사 완료',
}: CopyCurrentUrlButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (typeof window === 'undefined') {
      return;
    }

    const currentUrl = window.location.href;

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(currentUrl);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = currentUrl;
      textarea.setAttribute('readonly', 'true');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
    >
      {copied ? copiedLabel : label}
    </button>
  );
}

```


---

## `src/components/print-button.tsx`

```ts
'use client';

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white print:hidden"
    >
      인쇄 / PDF 저장
    </button>
  );
}

```


---

## `src/components/public-members-list.tsx`

```ts
'use client';

import { useMemo, useState } from 'react';
import { formatKoreanDate } from '@/lib/utils';
import { formatKoreanPhoneNumber, normalizeDigits } from '@/lib/korean-search';

type PublicMember = {
  id: string;
  name: string;
  phone: string | null;
  handicap: number | null;
  joined_on: string | null;
  role: 'admin' | 'member';
  roundsCount: number;
  averageScore: number | null;
  bestScore: number | null;
};

type PublicMembersListProps = {
  members: PublicMember[];
};

function StatPill({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-3 py-3 text-center">
      <p className="text-[11px] font-medium text-slate-400">{label}</p>
      <p className={accent ? 'mt-1 text-lg font-bold text-emerald-600' : 'mt-1 text-lg font-bold text-slate-900'}>{value}</p>
    </div>
  );
}

function InfoCell({ label, value, href, compact = false }: { label: string; value: string; href?: string; compact?: boolean }) {
  return (
    <div className={compact ? 'rounded-xl bg-slate-50 px-2.5 py-2' : 'rounded-2xl bg-slate-50 px-3 py-3'}>
      <dt className="text-[10px] font-medium leading-none text-slate-400">{label}</dt>
      <dd className="mt-1 text-sm font-semibold leading-tight text-slate-900">
        {href ? (
          <a href={href} className="whitespace-nowrap underline-offset-4 hover:underline">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

export function PublicMembersList({ members }: PublicMembersListProps) {
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const selectedMember = useMemo(
    () => members.find((member) => member.id === selectedMemberId) ?? null,
    [members, selectedMemberId],
  );

  return (
    <>
      <section className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
        {members.map((member) => {
          const formattedPhone = formatKoreanPhoneNumber(member.phone);
          const phoneDigits = normalizeDigits(member.phone);

          return (
            <article key={member.id} className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="grid grid-cols-[minmax(76px,0.42fr)_minmax(0,1fr)] gap-2.5 sm:grid-cols-[minmax(86px,0.38fr)_minmax(0,1fr)]">
                <div className="min-w-0 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedMemberId(member.id)}
                    className="text-left text-lg font-bold leading-tight text-slate-950 underline-offset-4 hover:underline"
                  >
                    {member.name}
                  </button>
                  <div className="mt-1.5 inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                    {member.role === 'admin' ? '운영진' : '회원'}
                  </div>
                </div>

                <dl className="grid min-w-0 grid-cols-2 gap-1.5">
                  <InfoCell label="가입일" value={member.joined_on ? formatKoreanDate(member.joined_on) : '-'} compact />
                  <InfoCell label="핸디캡" value={String(member.handicap ?? 0)} compact />
                  <div className="col-span-2">
                    <InfoCell label="연락처" value={formattedPhone} href={phoneDigits ? `tel:${phoneDigits}` : undefined} compact />
                  </div>
                </dl>
              </div>
            </article>
          );
        })}
      </section>

      {selectedMember ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-lg rounded-[32px] bg-white p-5 shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-emerald-600">회원 상세</p>
                <h2 className="mt-1 text-2xl font-extrabold tracking-[-0.02em] text-slate-950">{selectedMember.name}</h2>
                <div className="mt-2 inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                  {selectedMember.role === 'admin' ? '운영진' : '회원'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMemberId(null)}
                className="inline-flex size-11 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-500 transition hover:bg-slate-200"
                aria-label="회원 상세 닫기"
              >
                ×
              </button>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-2.5">
              <InfoCell label="가입일" value={selectedMember.joined_on ? formatKoreanDate(selectedMember.joined_on) : '-'} />
              <InfoCell label="핸디캡" value={String(selectedMember.handicap ?? 0)} />
              <InfoCell label="역할" value={selectedMember.role === 'admin' ? '운영진' : '회원'} />
              <div className="col-span-2">
                <InfoCell
                  label="연락처"
                  value={formatKoreanPhoneNumber(selectedMember.phone)}
                  href={normalizeDigits(selectedMember.phone) ? `tel:${normalizeDigits(selectedMember.phone)}` : undefined}
                />
              </div>
            </dl>

            <div className="mt-5 grid grid-cols-3 gap-2.5">
              <StatPill label="라운딩" value={String(selectedMember.roundsCount)} />
              <StatPill label="평균" value={selectedMember.averageScore == null ? '-' : String(selectedMember.averageScore)} />
              <StatPill label="베스트" value={selectedMember.bestScore == null ? '-' : String(selectedMember.bestScore)} accent />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

```


---

## `src/components/share-result-summary-button.tsx`

```ts
'use client';

import { useState } from 'react';

type ShareResultSummaryButtonProps = {
  summary: string;
  label?: string;
  copiedLabel?: string;
};

export function ShareResultSummaryButton({
  summary,
  label = '결과 요약 복사',
  copiedLabel = '요약 복사 완료',
}: ShareResultSummaryButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (typeof window === 'undefined') {
      return;
    }

    const text = `${summary}

결과 링크: ${window.location.href}`;

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', 'true');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-violet-600 px-4 py-2 text-center text-sm font-semibold text-white"
    >
      {copied ? copiedLabel : label}
    </button>
  );
}

```


---

## `src/lib/auth/require-member.ts`

```ts
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export type CurrentMember = {
  id: string;
  club_id: string;
  name: string;
  role: 'admin' | 'member';
};

export async function requireMember(): Promise<{
  supabase: Awaited<ReturnType<typeof createClient>>;
  member: CurrentMember;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: member, error } = await supabase
    .from('members')
    .select('id, club_id, name, role')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();

  if (error) {
    console.error('failed to load current member', error);
    redirect('/member-link?error=unknown');
  }

  if (!member) {
    redirect('/member-link');
  }

  return {
    supabase,
    member: member as CurrentMember,
  };
}

export async function requireAdmin(): Promise<{
  supabase: Awaited<ReturnType<typeof createClient>>;
  member: CurrentMember;
}> {
  const result = await requireMember();

  if (result.member.role !== 'admin') {
    redirect('/?error=admin_required');
  }

  return result;
}
```


---

## `src/lib/korean-search.ts`

```ts
const CHOSEONG = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
] as const;

const JUNGSEONG = [
  'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ',
] as const;

const JONGSEONG = [
  '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
] as const;

const KOREAN_DIAL: Record<string, string> = {
  ㄱ: '2', ㄲ: '2', ㅋ: '2',
  ㄴ: '3', ㄹ: '3',
  ㄷ: '4', ㄸ: '4', ㅌ: '4',
  ㅁ: '5',
  ㅂ: '6', ㅃ: '6', ㅍ: '6',
  ㅅ: '7', ㅆ: '7', ㅎ: '7',
  ㅈ: '8', ㅉ: '8', ㅊ: '8',
  ㅇ: '9',
};

const INITIAL_JAMO = new Set<string>(CHOSEONG);
const VOWEL_JAMO = new Set<string>(JUNGSEONG);

export function normalizeDigits(value?: string | null) {
  return String(value ?? '').replace(/\D/g, '');
}

export function normalizeSearchValue(value?: string | null) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[\s_.()\-]/g, '');
}

export function decomposeHangul(value?: string | null) {
  let choseong = '';
  let jamo = '';

  for (const char of normalizeSearchValue(value)) {
    const code = char.charCodeAt(0);

    if (code >= 0xac00 && code <= 0xd7a3) {
      const offset = code - 0xac00;
      const cho = Math.floor(offset / 588);
      const jung = Math.floor((offset % 588) / 28);
      const jong = offset % 28;
      const c = CHOSEONG[cho] ?? '';
      const m = JUNGSEONG[jung] ?? '';
      const f = JONGSEONG[jong] ?? '';
      choseong += c;
      jamo += c + m + f;
    } else {
      choseong += char;
      jamo += char;
    }
  }

  return { choseong, jamo };
}

export function formatKoreanPhoneNumber(value?: string | null) {
  const digits = normalizeDigits(value);

  if (!digits) {
    return '-';
  }

  if (digits.startsWith('02')) {
    if (digits.length === 9) {
      return digits.replace(/^(02)(\d{3})(\d{4})$/, '$1-$2-$3');
    }

    if (digits.length === 10) {
      return digits.replace(/^(02)(\d{4})(\d{4})$/, '$1-$2-$3');
    }
  }

  if (digits.length === 10) {
    return digits.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3');
  }

  if (digits.length === 11) {
    return digits.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
  }

  return digits;
}

export function toKoreanDialDigits(value?: string | null) {
  const { choseong } = decomposeHangul(value);

  return Array.from(choseong)
    .map((char) => KOREAN_DIAL[char] ?? (/[0-9]/.test(char) ? char : ''))
    .join('');
}

function isInitialOnly(value: string) {
  return Array.from(value).every((char) => INITIAL_JAMO.has(char));
}

function hasKoreanJamo(value: string) {
  return Array.from(value).some((char) => INITIAL_JAMO.has(char) || VOWEL_JAMO.has(char));
}

type MemberSearchTarget = {
  name?: string | null;
  phone?: string | null;
};

export function matchesMemberSearch(target: MemberSearchTarget, query: string) {
  const normalizedQuery = normalizeSearchValue(query);

  if (!normalizedQuery) {
    return true;
  }

  const queryDigits = normalizeDigits(query);
  const normalizedName = normalizeSearchValue(target.name);
  const phoneDigits = normalizeDigits(target.phone);
  const nameParts = decomposeHangul(target.name);
  const queryParts = decomposeHangul(normalizedQuery);

  if (/^\d+$/.test(normalizedQuery)) {
    if (phoneDigits.includes(normalizedQuery)) {
      return true;
    }

    // 스마트 다이얼은 한 글자 숫자에서는 너무 넓게 잡히므로 2자리 이상부터 이름 초성에 적용한다.
    return normalizedQuery.length >= 2 && toKoreanDialDigits(target.name).includes(normalizedQuery);
  }

  if (normalizedName.includes(normalizedQuery)) {
    return true;
  }

  if (hasKoreanJamo(normalizedQuery)) {
    if (isInitialOnly(normalizedQuery)) {
      return nameParts.choseong.includes(normalizedQuery);
    }

    return nameParts.jamo.includes(queryParts.jamo);
  }

  if (queryDigits) {
    return phoneDigits.includes(queryDigits);
  }

  return false;
}

export function createKoreanSearchTokens(values: Array<string | number | null | undefined>) {
  const source = values.map((value) => String(value ?? '')).join(' ');
  const normalized = normalizeSearchValue(source);
  const decomposed = decomposeHangul(source);
  const digits = normalizeDigits(source);
  const dial = toKoreanDialDigits(source);

  return [normalized, decomposed.choseong, decomposed.jamo, digits, dial].filter(Boolean);
}

export function matchesKoreanSmartSearch(values: Array<string | number | null | undefined>, query: string) {
  const target = {
    name: values.map((value) => String(value ?? '')).join(' '),
    phone: values.map((value) => String(value ?? '')).join(' '),
  };

  return matchesMemberSearch(target, query);
}

```


---

## `src/lib/round-game-labels.ts`

```ts
export type ParkBuddyPlayMode =
  | 'individual'
  | 'foursome'
  | 'fourball'
  | 'scramble'
  | 'team_match';

export type ParkBuddyScoringType =
  | 'stroke'
  | 'new_peoria'
  | 'match'
  | 'match_play'
  | 'stableford';

export function normalizeParkBuddyPlayMode(value?: string | null): ParkBuddyPlayMode {
  if (
    value === 'individual' ||
    value === 'foursome' ||
    value === 'fourball' ||
    value === 'scramble' ||
    value === 'team_match'
  ) {
    return value;
  }

  if (value === 'team') {
    return 'team_match';
  }

  return 'individual';
}

export function normalizeParkBuddyScoringType(value?: string | null): ParkBuddyScoringType {
  if (value === 'match_play') {
    return 'match';
  }

  if (
    value === 'stroke' ||
    value === 'new_peoria' ||
    value === 'match' ||
    value === 'stableford'
  ) {
    return value;
  }

  return 'stroke';
}

export function getParkBuddyPlayModeLabel(value?: string | null) {
  switch (normalizeParkBuddyPlayMode(value)) {
    case 'individual':
      return '개인전';
    case 'foursome':
      return '포섬';
    case 'fourball':
      return '포볼';
    case 'scramble':
      return '스크램블';
    case 'team_match':
      return '청백전';
    default:
      return '개인전';
  }
}

export function getParkBuddyScoringTypeLabel(value?: string | null) {
  switch (normalizeParkBuddyScoringType(value)) {
    case 'stroke':
      return '스트로크';
    case 'new_peoria':
      return '신페리오';
    case 'match':
    case 'match_play':
      return '매치';
    case 'stableford':
      return '스테이블포드';
    default:
      return '스트로크';
  }
}

export function getParkBuddyGameMethodLabel(
  playMode?: string | null,
  scoringType?: string | null,
) {
  return `${getParkBuddyPlayModeLabel(playMode)} ${getParkBuddyScoringTypeLabel(scoringType)}`;
}

export function getParkBuddyGameRuleDescription(
  playMode?: string | null,
  scoringType?: string | null,
) {
  const normalizedPlayMode = normalizeParkBuddyPlayMode(playMode);
  const normalizedScoringType = normalizeParkBuddyScoringType(scoringType);

  if (normalizedPlayMode === 'foursome') {
    if (normalizedScoringType === 'match') {
      return '두 명이 한 팀으로 하나의 공을 번갈아 치며, 홀별 승패를 비교합니다.';
    }

    return '두 명이 한 팀으로 하나의 공을 번갈아 치며, 팀 전체 타수를 계산합니다.';
  }

  if (normalizedPlayMode === 'fourball') {
    if (normalizedScoringType === 'stableford') {
      return '두 명이 각자 플레이하고 더 좋은 기록을 기준으로 점수를 계산합니다.';
    }

    if (normalizedScoringType === 'match') {
      return '두 명이 각자 플레이하고 팀의 좋은 기록으로 홀별 승패를 비교합니다.';
    }

    return '두 명이 각자 플레이하고 팀에서 더 좋은 기록을 반영합니다.';
  }

  if (normalizedPlayMode === 'scramble') {
    if (normalizedScoringType === 'match') {
      return '조별로 좋은 위치를 골라 이어 치며, 홀별 승패를 비교합니다.';
    }

    return '조별로 좋은 위치를 골라 이어 치며, 조 전체 타수를 계산합니다.';
  }

  if (normalizedPlayMode === 'team_match') {
    if (normalizedScoringType === 'new_peoria') {
      return '청팀과 백팀으로 나누고, 신페리오 보정 결과를 팀 단위로 비교합니다.';
    }

    if (normalizedScoringType === 'match') {
      return '청팀과 백팀으로 나누고, 각 조의 홀별 승패를 팀 점수로 합산합니다.';
    }

    return '청팀과 백팀으로 나누고, 팀별 전체 결과를 비교합니다.';
  }

  if (normalizedScoringType === 'new_peoria') {
    return '각자 플레이하며, 숨겨진 홀 기준으로 핸디캡을 보정해 순위를 계산합니다.';
  }

  if (normalizedScoringType === 'match') {
    return '각자 플레이하며, 홀마다 승패를 비교해 결과를 계산합니다.';
  }

  if (normalizedScoringType === 'stableford') {
    return '각자 플레이하며, 홀별 점수를 합산해 순위를 계산합니다.';
  }

  return '각자 플레이하며, 전체 타수를 기준으로 순위를 계산합니다.';
}

```


---

## `src/lib/round-linked-event-context.ts`

```ts
import type { SupabaseClient } from '@supabase/supabase-js';

export type LinkedEventContext = {
  id: string;
  title: string;
  eventType: string | null;
  startsAt: string | null;
  courseName: string | null;
  attendCount: number;
  absentCount: number;
  totalVoteCount: number;
};

type EventRow = {
  id: string;
  title: string | null;
  event_type: string | null;
  starts_at: string | null;
  course_name: string | null;
};

type EventVoteRow = {
  event_id: string;
  status: string | null;
};

function uniqueNonEmpty(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))));
}

function isMissingTableError(error: { code?: string } | null | undefined) {
  return error?.code === '42P01' || error?.code === '42703';
}

export async function getRoundLinkedEventContexts(
  supabase: SupabaseClient,
  clubId: string,
  eventIds: Array<string | null | undefined>,
) {
  const normalizedEventIds = uniqueNonEmpty(eventIds);

  if (!normalizedEventIds.length) {
    return new Map<string, LinkedEventContext>();
  }

  try {
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, title, event_type, starts_at, course_name')
      .eq('club_id', clubId)
      .in('id', normalizedEventIds);

    if (eventsError) {
      if (isMissingTableError(eventsError)) {
        return new Map<string, LinkedEventContext>();
      }

      console.error('[ParkBuddy] linked event context query failed:', eventsError.message);
      return new Map<string, LinkedEventContext>();
    }

    const eventRows = (events ?? []) as EventRow[];

    if (!eventRows.length) {
      return new Map<string, LinkedEventContext>();
    }

    const foundEventIds = eventRows.map((event) => event.id);
    const { data: votes, error: votesError } = await supabase
      .from('event_votes')
      .select('event_id, status')
      .in('event_id', foundEventIds);

    if (votesError) {
      if (isMissingTableError(votesError)) {
        return buildContextMap(eventRows, []);
      }

      console.error('[ParkBuddy] linked event vote query failed:', votesError.message);
      return buildContextMap(eventRows, []);
    }

    return buildContextMap(eventRows, (votes ?? []) as EventVoteRow[]);
  } catch (error) {
    console.error('[ParkBuddy] linked event context failed:', error);
    return new Map<string, LinkedEventContext>();
  }
}

function buildContextMap(eventRows: EventRow[], votes: EventVoteRow[]) {
  const voteSummaryByEventId = votes.reduce<
    Record<string, { attendCount: number; absentCount: number; totalVoteCount: number }>
  >((summary, vote) => {
    const current = summary[vote.event_id] ?? { attendCount: 0, absentCount: 0, totalVoteCount: 0 };
    current.totalVoteCount += 1;

    if (vote.status === 'attend' || vote.status === 'accepted' || vote.status === 'yes') {
      current.attendCount += 1;
    }

    if (vote.status === 'absent' || vote.status === 'decline' || vote.status === 'declined' || vote.status === 'no') {
      current.absentCount += 1;
    }

    summary[vote.event_id] = current;
    return summary;
  }, {});

  return new Map(
    eventRows.map((event) => {
      const summary = voteSummaryByEventId[event.id] ?? {
        attendCount: 0,
        absentCount: 0,
        totalVoteCount: 0,
      };

      return [
        event.id,
        {
          id: event.id,
          title: event.title?.trim() || '제목 없는 일정',
          eventType: event.event_type,
          startsAt: event.starts_at,
          courseName: event.course_name,
          ...summary,
        },
      ];
    }),
  );
}

```


---

## `src/lib/round-pairing-algorithm.ts`

```ts
import type { ParkBuddyPlayMode } from './round-game-labels';

export type ParkBuddyPairingParticipant = {
  id: string;
  name: string;
  handicap: number | null;
  averageStrokes?: number | null;
  roundsCount?: number | null;
  teamNo?: number | null;
};

type GroupState = {
  index: number;
  size: number;
  count: number;
  skillTotal: number;
  teamCounts: Record<string, number>;
};

function getSafeHandicap(value: number | null | undefined) {
  const numeric = Number(value ?? 0);
  return Number.isFinite(numeric) ? numeric : 0;
}

export function getParkBuddyPlayerSkillScore(participant: ParkBuddyPairingParticipant) {
  const averageStrokes = Number(participant.averageStrokes ?? NaN);
  const roundsCount = Number(participant.roundsCount ?? 0);
  const handicap = getSafeHandicap(participant.handicap);

  const averageBase = Number.isFinite(averageStrokes)
    ? Math.max(0, 120 - averageStrokes) * 10
    : Math.max(0, 80 - handicap) * 5;
  const participationBonus = Math.min(Math.max(roundsCount, 0), 30) * 4;

  return Math.round(averageBase + participationBonus);
}

function createGroups(groupSizes: number[]) {
  return groupSizes.map<GroupState>((size, index) => ({
    index,
    size,
    count: 0,
    skillTotal: 0,
    teamCounts: {},
  }));
}

function pickBalancedGroup(groups: GroupState[]) {
  return [...groups]
    .filter((group) => group.count < group.size)
    .sort((a, b) => {
      if (a.skillTotal !== b.skillTotal) {
        return a.skillTotal - b.skillTotal;
      }

      if (a.count !== b.count) {
        return a.count - b.count;
      }

      return a.index - b.index;
    })[0];
}

function pickTeamAwareGroup(groups: GroupState[], teamKey: string | null) {
  const candidates = groups.filter((group) => group.count < group.size);

  if (!candidates.length) {
    return null;
  }

  if (!teamKey) {
    return pickBalancedGroup(candidates);
  }

  return [...candidates].sort((a, b) => {
    const aTeamCount = a.teamCounts[teamKey] ?? 0;
    const bTeamCount = b.teamCounts[teamKey] ?? 0;

    if (aTeamCount !== bTeamCount) {
      return aTeamCount - bTeamCount;
    }

    if (a.skillTotal !== b.skillTotal) {
      return a.skillTotal - b.skillTotal;
    }

    if (a.count !== b.count) {
      return a.count - b.count;
    }

    return a.index - b.index;
  })[0];
}

function assignToGroup(
  assignments: Record<string, number>,
  group: GroupState | null | undefined,
  participant: ParkBuddyPairingParticipant,
) {
  if (!group) {
    return;
  }

  const skillScore = getParkBuddyPlayerSkillScore(participant);
  const teamKey = participant.teamNo ? String(participant.teamNo) : null;

  assignments[participant.id] = group.index;
  group.count += 1;
  group.skillTotal += skillScore;

  if (teamKey) {
    group.teamCounts[teamKey] = (group.teamCounts[teamKey] ?? 0) + 1;
  }
}

function hasUsefulTeamData(participants: ParkBuddyPairingParticipant[]) {
  const teamKeys = new Set(
    participants
      .map((participant) => participant.teamNo)
      .filter((teamNo): teamNo is number => typeof teamNo === 'number' && Number.isFinite(teamNo)),
  );

  return teamKeys.size >= 2;
}

export function buildParkBuddySmartAssignments(
  participants: ParkBuddyPairingParticipant[],
  groupSizes: number[],
  playMode: ParkBuddyPlayMode,
) {
  const groups = createGroups(groupSizes);
  const assignments: Record<string, number> = {};
  const sortedParticipants = [...participants].sort((a, b) => {
    const skillDifference = getParkBuddyPlayerSkillScore(b) - getParkBuddyPlayerSkillScore(a);

    if (skillDifference !== 0) {
      return skillDifference;
    }

    return a.name.localeCompare(b.name, 'ko-KR');
  });

  const shouldUseTeamBalance =
    (playMode === 'foursome' || playMode === 'fourball' || playMode === 'team_match') &&
    hasUsefulTeamData(participants);

  sortedParticipants.forEach((participant) => {
    const teamKey = participant.teamNo ? String(participant.teamNo) : null;
    const targetGroup = shouldUseTeamBalance
      ? pickTeamAwareGroup(groups, teamKey)
      : pickBalancedGroup(groups);

    assignToGroup(assignments, targetGroup, participant);
  });

  return assignments;
}

export function getParkBuddyPairingBasisMessage(
  participants: ParkBuddyPairingParticipant[],
  playMode: ParkBuddyPlayMode,
) {
  const hasTeamData = hasUsefulTeamData(participants);

  if (playMode === 'foursome' || playMode === 'fourball' || playMode === 'team_match') {
    if (hasTeamData) {
      return '팀 정보와 실력 점수를 함께 고려해 조마다 균형 있게 배치합니다.';
    }

    return '팀 정보가 부족해 평균타수와 참여횟수 기준으로 실력을 균등하게 배치합니다.';
  }

  return '평균타수와 참여횟수를 기준으로 조마다 실력이 균등하도록 배치합니다.';
}

```


---

## `src/lib/score-records.ts`

```ts
export type ScoreRoundInfo = {
  id: string;
  title: string | null;
  course_name: string | null;
  play_date: string | null;
  played_on: string | null;
  holes: number | null;
  deleted_at: string | null;
  club_id: string | null;
};

export type RawRoundScoreRow = {
  round_id: string;
  member_id: string;
  strokes: number | null;
  stableford_points: number | null;
  memo: string | null;
  updated_at: string | null;
  round: ScoreRoundInfo | ScoreRoundInfo[] | null;
};

export type OfficialScoreRecord = {
  round_id: string;
  member_id: string;
  title: string;
  course_name: string | null;
  play_date: string | null;
  holes: number | null;
  total_strokes: number | null;
  stableford_points: number | null;
  memo: string | null;
  updated_at: string | null;
};

export type OfficialScoreStats = {
  rounds_count: number;
  avg_score: number | null;
  best_score: number | null;
};

function firstRound(round: ScoreRoundInfo | ScoreRoundInfo[] | null): ScoreRoundInfo | null {
  if (Array.isArray(round)) {
    return round[0] ?? null;
  }

  return round;
}

export function getOfficialScoreDate(record: Pick<OfficialScoreRecord, 'play_date' | 'updated_at'>) {
  return record.play_date ?? record.updated_at ?? '';
}

function compareRecordDateDesc(left: OfficialScoreRecord, right: OfficialScoreRecord) {
  const leftTime = Date.parse(getOfficialScoreDate(left));
  const rightTime = Date.parse(getOfficialScoreDate(right));

  if (Number.isNaN(leftTime) && Number.isNaN(rightTime)) return 0;
  if (Number.isNaN(leftTime)) return 1;
  if (Number.isNaN(rightTime)) return -1;

  return rightTime - leftTime;
}

function compareRecordDateAsc(left: OfficialScoreRecord, right: OfficialScoreRecord) {
  return compareRecordDateDesc(right, left);
}

export function normalizeOfficialScoreRecords(rows: RawRoundScoreRow[] | null | undefined, clubId?: string) {
  return (rows ?? [])
    .map((row): OfficialScoreRecord | null => {
      const round = firstRound(row.round);

      if (!round || round.deleted_at) {
        return null;
      }

      if (clubId && round.club_id !== clubId) {
        return null;
      }

      if (typeof row.strokes !== 'number' && typeof row.stableford_points !== 'number') {
        return null;
      }

      return {
        round_id: row.round_id,
        member_id: row.member_id,
        title: round.title ?? '라운딩',
        course_name: round.course_name,
        play_date: round.play_date ?? round.played_on,
        holes: round.holes,
        total_strokes: row.strokes,
        stableford_points: row.stableford_points,
        memo: row.memo,
        updated_at: row.updated_at,
      };
    })
    .filter((record): record is OfficialScoreRecord => record !== null)
    .sort(compareRecordDateDesc);
}

export function getOfficialScoredRecords(records: OfficialScoreRecord[]) {
  return records.filter((record) => typeof record.total_strokes === 'number');
}

export function buildOfficialScoreStats(records: OfficialScoreRecord[]): OfficialScoreStats {
  const scoredRecords = getOfficialScoredRecords(records);

  if (!scoredRecords.length) {
    return {
      rounds_count: 0,
      avg_score: null,
      best_score: null,
    };
  }

  const totalScore = scoredRecords.reduce((sum, record) => sum + (record.total_strokes ?? 0), 0);
  const bestScore = Math.min(...scoredRecords.map((record) => record.total_strokes ?? Number.POSITIVE_INFINITY));

  return {
    rounds_count: scoredRecords.length,
    avg_score: Math.round((totalScore / scoredRecords.length) * 10) / 10,
    best_score: Number.isFinite(bestScore) ? bestScore : null,
  };
}

export function buildOfficialScoreStatsByMember(records: OfficialScoreRecord[]) {
  const grouped = new Map<string, OfficialScoreRecord[]>();

  for (const record of records) {
    const current = grouped.get(record.member_id) ?? [];
    current.push(record);
    grouped.set(record.member_id, current);
  }

  return new Map(Array.from(grouped.entries()).map(([memberId, memberRecords]) => [memberId, buildOfficialScoreStats(memberRecords)]));
}

export function getOfficialScoreTrend(records: OfficialScoreRecord[], limit = 20) {
  return getOfficialScoredRecords(records)
    .slice()
    .sort(compareRecordDateAsc)
    .slice(-limit)
    .map((record) => ({
      played_on: getOfficialScoreDate(record),
      total_strokes: record.total_strokes ?? 0,
    }));
}

```


---

## `src/lib/security/files.ts`

```ts
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const JPEG_MAGIC = [0xff, 0xd8, 0xff];
const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const RIFF_MAGIC = [0x52, 0x49, 0x46, 0x46];
const WEBP_MAGIC = [0x57, 0x45, 0x42, 0x50];

export async function validateImageFile(file: File | null) {
  if (!file || file.size === 0) {
    return { ok: true as const, file: null };
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return { ok: false as const, message: '이미지는 최대 5MB까지 업로드할 수 있습니다.' };
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return { ok: false as const, message: 'jpg, png, webp 이미지만 업로드할 수 있습니다.' };
  }

  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());

  if (!matchesImageSignature(file.type, bytes)) {
    return { ok: false as const, message: '이미지 파일 형식이 올바르지 않습니다.' };
  }

  const extension = getSafeImageExtension(file.type);
  return { ok: true as const, file, extension };
}

function startsWith(bytes: Uint8Array, signature: number[]) {
  return signature.every((value, index) => bytes[index] === value);
}

function matchesImageSignature(contentType: string, bytes: Uint8Array) {
  if (contentType === 'image/jpeg') {
    return startsWith(bytes, JPEG_MAGIC);
  }

  if (contentType === 'image/png') {
    return startsWith(bytes, PNG_MAGIC);
  }

  if (contentType === 'image/webp') {
    return startsWith(bytes, RIFF_MAGIC) && WEBP_MAGIC.every((value, index) => bytes[index + 8] === value);
  }

  return false;
}

export function getSafeImageExtension(contentType: string) {
  switch (contentType) {
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    default:
      return 'jpg';
  }
}

```


---

## `src/lib/security/validation.ts`

```ts
import { z } from 'zod';

const safeText = (min = 1, max = 100) =>
  z
    .string()
    .trim()
    .min(min, '필수 입력값입니다.')
    .max(max, `최대 ${max}자까지 입력할 수 있습니다.`)
    .refine((value) => !/[<>]/.test(value), '꺾쇠 괄호는 사용할 수 없습니다.');

export const memberFormSchema = z.object({
  name: safeText(1, 40),
  phone: z
    .string()
    .trim()
    .max(20)
    .regex(/^[0-9+\-\s()]*$/, '전화번호 형식이 올바르지 않습니다.')
    .optional()
    .transform((value) => value || null),
  handicap: z.coerce.number().min(-50).max(200),
  joined_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  role: z.enum(['admin', 'member']).default('member'),
});

export const eventFormSchema = z.object({
  title: safeText(1, 80),
  event_type: z.enum(['regular', 'tournament', 'casual']).default('regular'),
  starts_at: z.string().min(10).max(40),
  course_name: safeText(1, 80),
  holes: z.coerce.number().int().refine((value) => [9, 18, 27, 36].includes(value)),
  max_participants: z.coerce.number().int().min(1).max(200).optional().nullable(),
  memo: z.string().trim().max(1000).optional().transform((value) => value || null),
});

export const voteSchema = z.object({
  eventId: z.string().uuid(),
  status: z.enum(['attend', 'absent', 'maybe']),
});

export const roundFormSchema = z.object({
  title: safeText(1, 80),
  event_id: z.string().uuid().optional().nullable(),
  played_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  course_name: safeText(1, 80),
  holes: z.coerce.number().int().refine((value) => [9, 18, 27, 36].includes(value)),
  memo: z.string().trim().max(1000).optional().transform((value) => value || null),
});

export const scoreSchema = z.object({
  roundId: z.string().uuid(),
  memberId: z.string().uuid(),
  scores: z
    .array(
      z.object({
        hole_no: z.number().int().min(1).max(36),
        par: z.number().int().min(2).max(6),
        strokes: z.number().int().min(1).max(20),
      })
    )
    .min(1)
    .max(36),
});

export const postFormSchema = z.object({
  title: safeText(1, 100),
  content: z
    .string()
    .trim()
    .min(1, '필수 입력값입니다.')
    .max(5000, '최대 5000자까지 입력할 수 있습니다.')
    .refine((value) => !/[<>]/.test(value), '꺾쇠 괄호는 사용할 수 없습니다.'),
  post_type: z.enum(['notice', 'free']).default('free'),
  is_private: z
    .preprocess((value) => value === 'on' || value === 'true' || value === true, z.boolean())
    .default(false),
});

export const profileFormSchema = z.object({
  name: safeText(1, 40),
  phone: z
    .string()
    .trim()
    .max(20)
    .regex(/^[0-9+\-\s()]*$/, '전화번호 형식이 올바르지 않습니다.')
    .optional()
    .transform((value) => value || null),
  handicap: z.coerce.number().min(-50).max(200),
});

export function formDataToObject(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

```


---

## `src/lib/supabase/client.ts`

```ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase 환경 변수가 설정되지 않았습니다.');
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}

```


---

## `src/lib/supabase/middleware.ts`

```ts
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  await supabase.auth.getUser();
  return response;
}

```


---

## `src/lib/supabase/server.ts`

```ts
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function createClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase 환경 변수가 설정되지 않았습니다.');
  }

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components may not be able to set cookies directly.
        }
      },
    },
  });
}

```


---

## `src/lib/utils.ts`

```ts
import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatKoreanDateTime(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function formatKoreanDate(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
  }).format(date);
}

export function normalizePhone(value: string) {
  return value.replace(/[^0-9+]/g, '').slice(0, 20);
}

export function getInitial(name: string) {
  return name.trim().slice(0, 1) || '?';
}

export function toNumber(value: FormDataEntryValue | null, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

```


---

## `src/server/actions/event-rounds.ts`

```ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/server/auth';

function getEventRoundErrorCode(message?: string) {
  if (!message) return 'unknown';
  if (message.includes('AUTH_REQUIRED')) return 'auth_required';
  if (message.includes('ADMIN_REQUIRED')) return 'admin_required';
  if (message.includes('EVENT_NOT_FOUND')) return 'event_not_found';
  if (message.includes('NO_ATTENDEES')) return 'no_attendees';
  if (message.includes('INVALID_EVENT')) return 'event_not_found';
  if (message.includes('Could not find the function')) return 'rpc_missing';
  if (message.includes('permission denied')) return 'permission_denied';
  return 'unknown';
}

export async function createRoundFromEventAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const eventId = String(formData.get('eventId') ?? '').trim();

  if (!eventId) {
    redirect('/schedule?eventRoundError=event_not_found');
  }

  const { data: roundId, error } = await supabase.rpc('admin_create_round_from_event', {
    p_event_id: eventId,
  });

  if (error || !roundId) {
    console.error('admin_create_round_from_event failed', {
      eventId,
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
      code: error?.code,
    });

    redirect(`/schedule?eventRoundError=${getEventRoundErrorCode(error?.message)}`);
  }

  revalidatePath('/schedule');
  revalidatePath('/admin');
  revalidatePath('/admin/rounds');
  revalidatePath(`/admin/rounds/${roundId}/participants`);

  redirect(`/admin/rounds/${roundId}/participants?createdFromEvent=1`);
}

```


---

## `src/server/actions/events.ts`

```ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eventFormSchema, formDataToObject } from '@/lib/security/validation';
import { requireAdmin } from '@/server/auth';

export async function createEvent(formData: FormData) {
  const { supabase, member } = await requireAdmin();
  const raw = formDataToObject(formData);
  const normalized = {
    ...raw,
    max_participants: raw.max_participants === '' ? undefined : raw.max_participants,
  };
  const parsed = eventFormSchema.safeParse(normalized);

  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? '입력값이 올바르지 않습니다.');

  const { error } = await supabase.from('events').insert({
    club_id: member.club_id,
    title: parsed.data.title,
    event_type: parsed.data.event_type,
    starts_at: new Date(parsed.data.starts_at).toISOString(),
    course_name: parsed.data.course_name,
    holes: parsed.data.holes,
    max_participants: parsed.data.max_participants,
    memo: parsed.data.memo,
    created_by: member.id,
  });

  if (error) throw new Error(error.message);
  revalidatePath('/schedule');
  redirect('/schedule');
}

```


---

## `src/server/actions/members.ts`

```ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { formDataToObject, memberFormSchema } from '@/lib/security/validation';
import { normalizePhone } from '@/lib/utils';
import { requireAdmin } from '@/server/auth';

export async function createMember(formData: FormData) {
  const { supabase, member: me } = await requireAdmin();
  const parsed = memberFormSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? '입력값이 올바르지 않습니다.');

  const payload = parsed.data;
  const { error } = await supabase.from('members').insert({
    club_id: me.club_id,
    name: payload.name,
    phone: payload.phone ? normalizePhone(payload.phone) : null,
    handicap: payload.handicap,
    joined_on: payload.joined_on || new Date().toISOString().slice(0, 10),
    role: payload.role,
    status: 'active',
  });

  if (error) throw new Error(error.message);
  revalidatePath('/members');
  redirect('/members');
}

export async function updateMember(formData: FormData) {
  const { supabase, member: me } = await requireAdmin();
  const id = z.string().uuid().parse(formData.get('id'));
  const parsed = memberFormSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? '입력값이 올바르지 않습니다.');

  const payload = parsed.data;
  const { error } = await supabase
    .from('members')
    .update({
      name: payload.name,
      phone: payload.phone ? normalizePhone(payload.phone) : null,
      handicap: payload.handicap,
      joined_on: payload.joined_on || undefined,
      role: payload.role,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('club_id', me.club_id);

  if (error) throw new Error(error.message);
  revalidatePath('/members');
  redirect('/members');
}

export async function deleteMember(formData: FormData) {
  const { supabase, member: me } = await requireAdmin();
  const id = z.string().uuid().parse(formData.get('id'));

  if (id === me.id) throw new Error('본인 계정은 비활성화할 수 없습니다.');

  const { error } = await supabase
    .from('members')
    .update({ status: 'inactive', updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('club_id', me.club_id);

  if (error) throw new Error(error.message);
  revalidatePath('/members');
}

```


---

## `src/server/actions/posts.ts`

```ts
'use server';

import { randomUUID } from 'crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { formDataToObject, postFormSchema } from '@/lib/security/validation';
import { validateImageFile } from '@/lib/security/files';
import { requireCurrentMember } from '@/server/auth';

export async function createPost(formData: FormData) {
  const { supabase, member } = await requireCurrentMember();
  const parsed = postFormSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? '입력값이 올바르지 않습니다.');
  if (parsed.data.post_type === 'notice' && member.role !== 'admin') throw new Error('공지사항은 운영진만 작성할 수 있습니다.');

  const imageResult = await validateImageFile(formData.get('image') as File | null);
  if (!imageResult.ok) throw new Error(imageResult.message);

  const { data: post, error } = await supabase
    .from('posts')
    .insert({
      club_id: member.club_id,
      author_id: member.id,
      post_type: parsed.data.post_type,
      title: parsed.data.title,
      content: parsed.data.content,
      is_pinned: parsed.data.post_type === 'notice',
      is_private: parsed.data.is_private,
    })
    .select('id')
    .single();

  if (error || !post) throw new Error(error?.message ?? '게시글 저장 실패');

  if (imageResult.file) {
    const path = `${member.club_id}/${post.id}/${randomUUID()}.${imageResult.extension}`;
    const { error: uploadError } = await supabase.storage.from('post-images').upload(path, imageResult.file, {
      contentType: imageResult.file.type,
      cacheControl: '3600',
      upsert: false,
    });

    if (uploadError) throw new Error(uploadError.message);

    const { error: attachmentError } = await supabase.from('post_attachments').insert({
      post_id: post.id,
      file_path: path,
      content_type: imageResult.file.type,
    });

    if (attachmentError) throw new Error(attachmentError.message);
  }

  revalidatePath('/board');
  redirect(`/board/${post.id}`);
}

```


---

## `src/server/actions/profile.ts`

```ts
'use server';

import { revalidatePath } from 'next/cache';
import { formDataToObject, profileFormSchema } from '@/lib/security/validation';
import { normalizePhone } from '@/lib/utils';
import { requireCurrentMember } from '@/server/auth';

export async function updateMyProfile(formData: FormData) {
  const { supabase, member } = await requireCurrentMember();
  const parsed = profileFormSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? '입력값이 올바르지 않습니다.');

  const { error } = await supabase
    .from('members')
    .update({
      name: parsed.data.name,
      phone: parsed.data.phone ? normalizePhone(parsed.data.phone) : null,
      handicap: parsed.data.handicap,
      updated_at: new Date().toISOString(),
    })
    .eq('id', member.id)
    .eq('club_id', member.club_id);

  if (error) throw new Error(error.message);
  revalidatePath('/mypage');
}

```


---

## `src/server/actions/scores.ts`

```ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { formDataToObject, roundFormSchema, scoreSchema } from '@/lib/security/validation';
import { requireAdmin, requireCurrentMember } from '@/server/auth';

export async function createRound(formData: FormData) {
  const { supabase, member } = await requireAdmin();
  const raw = formDataToObject(formData);
  const normalized = {
    ...raw,
    event_id: raw.event_id === '' ? undefined : raw.event_id,
  };
  const parsed = roundFormSchema.safeParse(normalized);

  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? '입력값이 올바르지 않습니다.');

  const { data: round, error } = await supabase
    .from('rounds')
    .insert({
      club_id: member.club_id,
      event_id: parsed.data.event_id,
      title: parsed.data.title,
      played_on: parsed.data.played_on,
      course_name: parsed.data.course_name,
      holes: parsed.data.holes,
      memo: parsed.data.memo,
      created_by: member.id,
    })
    .select('id')
    .single();

  if (error || !round) throw new Error(error?.message ?? '라운딩 등록 실패');
  revalidatePath('/scores');
  redirect(`/scores/${round.id}`);
}

export async function saveScore(formData: FormData) {
  const { supabase, member: me } = await requireCurrentMember();

  const rawScores = z.string().parse(formData.get('scores'));
  const parsedJson = JSON.parse(rawScores) as unknown;
  const parsed = scoreSchema.safeParse({
    roundId: formData.get('roundId'),
    memberId: formData.get('memberId'),
    scores: parsedJson,
  });

  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? '스코어 데이터가 올바르지 않습니다.');

  if (me.role !== 'admin' && parsed.data.memberId !== me.id) {
    throw new Error('본인 스코어만 저장할 수 있습니다.');
  }

  const { data: targetMember, error: targetMemberError } = await supabase
    .from('members')
    .select('id, club_id')
    .eq('id', parsed.data.memberId)
    .eq('club_id', me.club_id)
    .eq('status', 'active')
    .maybeSingle();

  if (targetMemberError || !targetMember) throw new Error('대상 회원을 찾을 수 없습니다.');

  const { data: round, error: roundError } = await supabase
    .from('rounds')
    .select('id, club_id, holes')
    .eq('id', parsed.data.roundId)
    .eq('club_id', me.club_id)
    .maybeSingle();

  if (roundError || !round) throw new Error('라운딩을 찾을 수 없습니다.');
  if (parsed.data.scores.length !== round.holes) throw new Error('홀 수와 스코어 개수가 일치하지 않습니다.');

  const { data: roundPlayer, error: playerError } = await supabase
    .from('round_players')
    .upsert({ round_id: parsed.data.roundId, member_id: parsed.data.memberId }, { onConflict: 'round_id,member_id' })
    .select('id')
    .single();

  if (playerError || !roundPlayer) throw new Error(playerError?.message ?? '라운딩 참가자 저장 실패');

  const payload = parsed.data.scores.map((score) => ({
    round_player_id: roundPlayer.id,
    hole_no: score.hole_no,
    par: score.par,
    strokes: score.strokes,
  }));

  const { error: scoreError } = await supabase.from('hole_scores').upsert(payload, { onConflict: 'round_player_id,hole_no' });
  if (scoreError) throw new Error(scoreError.message);

  revalidatePath('/scores');
  revalidatePath(`/scores/${parsed.data.roundId}`);
}

```


---

## `src/server/actions/votes.ts`

```ts
'use server';

import { revalidatePath } from 'next/cache';
import { voteSchema } from '@/lib/security/validation';
import { requireCurrentMember } from '@/server/auth';

export async function voteEvent(input: { eventId: string; status: 'attend' | 'absent' | 'maybe' }) {
  const { supabase, member } = await requireCurrentMember();
  const parsed = voteSchema.parse(input);

  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('id, club_id')
    .eq('id', parsed.eventId)
    .eq('club_id', member.club_id)
    .maybeSingle();

  if (eventError || !event) throw new Error('일정을 찾을 수 없습니다.');

  const { error } = await supabase.from('event_votes').upsert(
    {
      event_id: parsed.eventId,
      member_id: member.id,
      status: parsed.status,
      voted_at: new Date().toISOString(),
    },
    { onConflict: 'event_id,member_id' }
  );

  if (error) throw new Error(error.message);
  revalidatePath('/schedule');
}

```


---

## `src/server/auth.ts`

```ts
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { CurrentMember } from '@/types/domain';

export async function getUserOrNull() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function requireUser() {
  const { supabase, user } = await getUserOrNull();
  if (!user) redirect('/login');
  return { supabase, user };
}

export async function getCurrentMember(): Promise<{
  supabase: Awaited<ReturnType<typeof createClient>>;
  member: CurrentMember | null;
}> {
  const { supabase, user } = await requireUser();

  const { data, error } = await supabase
    .from('members')
    .select('id, club_id, name, role, status')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return { supabase, member: data as CurrentMember | null };
}

export async function requireCurrentMember() {
  const { supabase, member } = await getCurrentMember();
  if (!member) redirect('/mypage/link');
  return { supabase, member };
}

export async function requireAdmin() {
  const { supabase, member } = await requireCurrentMember();
  if (member.role !== 'admin') redirect('/');
  return { supabase, member };
}

```


---

## `src/types/domain.ts`

```ts
export type MemberRole = 'admin' | 'member';
export type MemberStatus = 'active' | 'inactive';
export type EventType = 'regular' | 'tournament' | 'casual';
export type VoteStatus = 'attend' | 'absent' | 'maybe';
export type PostType = 'notice' | 'free';

export type CurrentMember = {
  id: string;
  club_id: string;
  name: string;
  role: MemberRole;
  status: MemberStatus;
};

export type ActionResult = {
  ok: boolean;
  message?: string;
};

export type HoleScoreInput = {
  hole_no: number;
  par: number;
  strokes: number;
};

```


---

## `supabase/PARKBUDDY_BOARD_SECURITY_SQL_CHECK.sql`

```sql
-- ParkBuddy board private security read-only verification
-- Purpose: Run this in Supabase SQL Editor after applying supabase/parkbuddy_board_private_security.sql.
-- This query does not change data. It checks the column, policies, trigger, and storage bucket policies needed for private board posts.

with expected_items as (
  select * from (values
    ('column', 'public.posts.is_private'),
    ('policy', 'public.posts.members can read allowed club posts'),
    ('policy', 'public.posts.members can create free posts and admins can create notices'),
    ('policy', 'public.posts.authors or admins can update posts'),
    ('policy', 'public.posts.authors or admins can delete posts'),
    ('policy', 'public.post_attachments.members can read allowed post attachments'),
    ('policy', 'storage.objects.members can read allowed post images'),
    ('policy', 'storage.objects.authors or admins can upload post images'),
    ('trigger', 'public.posts.prevent_post_privilege_escalation')
  ) as t(item_type, item_name)
), actual_items as (
  select
    'column' as item_type,
    table_schema || '.' || table_name || '.' || column_name as item_name,
    data_type || '; nullable=' || is_nullable || '; default=' || coalesce(column_default, 'null') as detail
  from information_schema.columns
  where table_schema = 'public'
    and table_name = 'posts'
    and column_name = 'is_private'

  union all

  select
    'policy' as item_type,
    schemaname || '.' || tablename || '.' || policyname as item_name,
    'cmd=' || cmd || '; roles=' || coalesce(roles::text, 'null') || '; permissive=' || permissive as detail
  from pg_policies
  where (schemaname = 'public' and tablename in ('posts', 'post_attachments'))
     or (schemaname = 'storage' and tablename = 'objects')

  union all

  select
    'trigger' as item_type,
    event_object_schema || '.' || event_object_table || '.' || trigger_name as item_name,
    action_timing || ' ' || event_manipulation || '; enabled' as detail
  from information_schema.triggers
  where event_object_schema = 'public'
    and event_object_table = 'posts'
    and trigger_name = 'prevent_post_privilege_escalation'
)
select
  e.item_type,
  e.item_name,
  case when a.item_name is null then 'FAIL' else 'PASS' end as check_result,
  coalesce(a.detail, 'missing') as detail
from expected_items e
left join actual_items a
  on a.item_type = e.item_type
 and a.item_name = e.item_name
order by
  case when a.item_name is null then 0 else 1 end,
  e.item_type,
  e.item_name;

```


---

## `supabase/migrations/0001_secure_schema.sql`

```sql
-- ParkBuddy secure schema migration
-- Apply in Supabase SQL Editor or via Supabase CLI.

create extension if not exists "pgcrypto";

create table if not exists public.clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  invite_code text unique,
  created_at timestamptz not null default now()
);

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  name text not null check (char_length(name) between 1 and 40),
  phone text check (phone is null or char_length(phone) <= 20),
  handicap numeric(5,1) not null default 0 check (handicap between -50 and 200),
  joined_on date not null default current_date,
  avatar_path text,
  role text not null default 'member' check (role in ('admin', 'member')),
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists members_user_unique on public.members(user_id) where user_id is not null;
create unique index if not exists members_club_phone_unique on public.members(club_id, phone) where phone is not null;
create index if not exists members_club_status_idx on public.members(club_id, status);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 80),
  event_type text not null default 'regular' check (event_type in ('regular', 'tournament', 'casual')),
  starts_at timestamptz not null,
  course_name text not null check (char_length(course_name) between 1 and 80),
  holes int not null default 18 check (holes in (9, 18, 27, 36)),
  max_participants int check (max_participants is null or max_participants between 1 and 200),
  memo text check (memo is null or char_length(memo) <= 1000),
  created_by uuid references public.members(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists events_club_starts_idx on public.events(club_id, starts_at);

create table if not exists public.event_votes (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete cascade,
  status text not null check (status in ('attend', 'absent', 'maybe')),
  note text check (note is null or char_length(note) <= 500),
  voted_at timestamptz not null default now(),
  unique(event_id, member_id)
);

create index if not exists event_votes_event_status_idx on public.event_votes(event_id, status);

create table if not exists public.rounds (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  event_id uuid references public.events(id) on delete set null,
  title text not null check (char_length(title) between 1 and 80),
  played_on date not null default current_date,
  course_name text not null check (char_length(course_name) between 1 and 80),
  holes int not null default 18 check (holes in (9, 18, 27, 36)),
  memo text check (memo is null or char_length(memo) <= 1000),
  created_by uuid references public.members(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists rounds_club_played_idx on public.rounds(club_id, played_on desc);

create table if not exists public.round_players (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references public.rounds(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete cascade,
  memo text check (memo is null or char_length(memo) <= 500),
  created_at timestamptz not null default now(),
  unique(round_id, member_id)
);

create index if not exists round_players_member_idx on public.round_players(member_id);

create table if not exists public.hole_scores (
  id uuid primary key default gen_random_uuid(),
  round_player_id uuid not null references public.round_players(id) on delete cascade,
  hole_no int not null check (hole_no between 1 and 36),
  par int not null default 3 check (par between 2 and 6),
  strokes int not null check (strokes between 1 and 20),
  unique(round_player_id, hole_no)
);

create index if not exists hole_scores_round_player_idx on public.hole_scores(round_player_id);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  author_id uuid references public.members(id) on delete set null,
  post_type text not null default 'free' check (post_type in ('notice', 'free')),
  title text not null check (char_length(title) between 1 and 100),
  content text not null check (char_length(content) between 1 and 5000),
  is_pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_club_created_idx on public.posts(club_id, is_pinned desc, created_at desc);

create table if not exists public.post_attachments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  file_path text not null,
  content_type text check (content_type in ('image/jpeg', 'image/png', 'image/webp')),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists post_attachments_post_idx on public.post_attachments(post_id, sort_order);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_members_updated_at on public.members;
create trigger touch_members_updated_at before update on public.members for each row execute function public.touch_updated_at();

drop trigger if exists touch_posts_updated_at on public.posts;
create trigger touch_posts_updated_at before update on public.posts for each row execute function public.touch_updated_at();


create or replace function public.prevent_member_privilege_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return new;
  end if;

  if not public.is_club_admin(old.club_id) then
    if new.club_id is distinct from old.club_id
       or new.user_id is distinct from old.user_id
       or new.role is distinct from old.role
       or new.status is distinct from old.status
       or new.joined_on is distinct from old.joined_on then
      raise exception 'not allowed to update protected member fields';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_member_privilege_escalation on public.members;
create trigger prevent_member_privilege_escalation before update on public.members for each row execute function public.prevent_member_privilege_escalation();

create or replace function public.prevent_post_privilege_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return new;
  end if;

  if not public.is_club_admin(old.club_id) then
    if new.club_id is distinct from old.club_id
       or new.author_id is distinct from old.author_id
       or new.post_type is distinct from old.post_type
       or new.is_pinned is distinct from old.is_pinned then
      raise exception 'not allowed to update protected post fields';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_post_privilege_escalation on public.posts;
create trigger prevent_post_privilege_escalation before update on public.posts for each row execute function public.prevent_post_privilege_escalation();

create or replace function public.current_member_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.members where user_id = auth.uid() and status = 'active' limit 1
$$;

create or replace function public.current_club_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select club_id from public.members where user_id = auth.uid() and status = 'active' limit 1
$$;

create or replace function public.is_club_admin(target_club_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.members
    where user_id = auth.uid()
      and club_id = target_club_id
      and role = 'admin'
      and status = 'active'
  )
$$;

alter table public.clubs enable row level security;
alter table public.members enable row level security;
alter table public.events enable row level security;
alter table public.event_votes enable row level security;
alter table public.rounds enable row level security;
alter table public.round_players enable row level security;
alter table public.hole_scores enable row level security;
alter table public.posts enable row level security;
alter table public.post_attachments enable row level security;

-- Clubs
create policy "members can read their club" on public.clubs for select to authenticated using (id = public.current_club_id());
create policy "admins can update their club" on public.clubs for update to authenticated using (public.is_club_admin(id)) with check (public.is_club_admin(id));

-- Members
create policy "members can read same club members" on public.members for select to authenticated using (club_id = public.current_club_id());
create policy "admins can insert same club members" on public.members for insert to authenticated with check (public.is_club_admin(club_id));
create policy "admins can update same club members" on public.members for update to authenticated using (public.is_club_admin(club_id)) with check (public.is_club_admin(club_id));
create policy "members can update own limited profile" on public.members for update to authenticated using (id = public.current_member_id()) with check (id = public.current_member_id() and club_id = public.current_club_id());

-- Events
create policy "members can read club events" on public.events for select to authenticated using (club_id = public.current_club_id());
create policy "admins can insert club events" on public.events for insert to authenticated with check (public.is_club_admin(club_id));
create policy "admins can update club events" on public.events for update to authenticated using (public.is_club_admin(club_id)) with check (public.is_club_admin(club_id));
create policy "admins can delete club events" on public.events for delete to authenticated using (public.is_club_admin(club_id));

-- Event votes
create policy "members can read club votes" on public.event_votes for select to authenticated using (
  exists (select 1 from public.events e where e.id = event_votes.event_id and e.club_id = public.current_club_id())
);
create policy "members can insert own vote" on public.event_votes for insert to authenticated with check (
  member_id = public.current_member_id()
  and exists (select 1 from public.events e where e.id = event_votes.event_id and e.club_id = public.current_club_id())
);
create policy "members can update own vote" on public.event_votes for update to authenticated using (member_id = public.current_member_id()) with check (member_id = public.current_member_id());
create policy "admins can manage club votes" on public.event_votes for all to authenticated using (
  exists (select 1 from public.events e where e.id = event_votes.event_id and public.is_club_admin(e.club_id))
) with check (
  exists (select 1 from public.events e where e.id = event_votes.event_id and public.is_club_admin(e.club_id))
);

-- Rounds
create policy "members can read club rounds" on public.rounds for select to authenticated using (club_id = public.current_club_id());
create policy "admins can insert club rounds" on public.rounds for insert to authenticated with check (public.is_club_admin(club_id));
create policy "admins can update club rounds" on public.rounds for update to authenticated using (public.is_club_admin(club_id)) with check (public.is_club_admin(club_id));
create policy "admins can delete club rounds" on public.rounds for delete to authenticated using (public.is_club_admin(club_id));

-- Round players
create policy "members can read club round players" on public.round_players for select to authenticated using (
  exists (select 1 from public.rounds r where r.id = round_players.round_id and r.club_id = public.current_club_id())
);
create policy "members can insert own round player" on public.round_players for insert to authenticated with check (
  member_id = public.current_member_id()
  and exists (select 1 from public.rounds r where r.id = round_players.round_id and r.club_id = public.current_club_id())
);
create policy "admins can manage club round players" on public.round_players for all to authenticated using (
  exists (select 1 from public.rounds r where r.id = round_players.round_id and public.is_club_admin(r.club_id))
) with check (
  exists (select 1 from public.rounds r where r.id = round_players.round_id and public.is_club_admin(r.club_id))
);

-- Hole scores
create policy "members can read club hole scores" on public.hole_scores for select to authenticated using (
  exists (
    select 1 from public.round_players rp join public.rounds r on r.id = rp.round_id
    where rp.id = hole_scores.round_player_id and r.club_id = public.current_club_id()
  )
);
create policy "members can insert own hole scores" on public.hole_scores for insert to authenticated with check (
  exists (
    select 1 from public.round_players rp join public.rounds r on r.id = rp.round_id
    where rp.id = hole_scores.round_player_id and rp.member_id = public.current_member_id() and r.club_id = public.current_club_id()
  )
);
create policy "members can update own hole scores" on public.hole_scores for update to authenticated using (
  exists (
    select 1 from public.round_players rp join public.rounds r on r.id = rp.round_id
    where rp.id = hole_scores.round_player_id and rp.member_id = public.current_member_id() and r.club_id = public.current_club_id()
  )
) with check (
  exists (
    select 1 from public.round_players rp join public.rounds r on r.id = rp.round_id
    where rp.id = hole_scores.round_player_id and rp.member_id = public.current_member_id() and r.club_id = public.current_club_id()
  )
);
create policy "admins can manage club hole scores" on public.hole_scores for all to authenticated using (
  exists (
    select 1 from public.round_players rp join public.rounds r on r.id = rp.round_id
    where rp.id = hole_scores.round_player_id and public.is_club_admin(r.club_id)
  )
) with check (
  exists (
    select 1 from public.round_players rp join public.rounds r on r.id = rp.round_id
    where rp.id = hole_scores.round_player_id and public.is_club_admin(r.club_id)
  )
);

-- Posts
create policy "members can read club posts" on public.posts for select to authenticated using (club_id = public.current_club_id());
create policy "members can create free posts and admins can create notices" on public.posts for insert to authenticated with check (
  club_id = public.current_club_id()
  and author_id = public.current_member_id()
  and ((post_type = 'free' and is_pinned = false) or public.is_club_admin(club_id))
);
create policy "authors or admins can update posts" on public.posts for update to authenticated using (
  author_id = public.current_member_id() or public.is_club_admin(club_id)
) with check (
  public.is_club_admin(club_id)
  or (
    author_id = public.current_member_id()
    and club_id = public.current_club_id()
    and post_type = 'free'
    and is_pinned = false
  )
);
create policy "authors or admins can delete posts" on public.posts for delete to authenticated using (
  author_id = public.current_member_id() or public.is_club_admin(club_id)
);

-- Post attachments
create policy "members can read club attachments" on public.post_attachments for select to authenticated using (
  exists (select 1 from public.posts p where p.id = post_attachments.post_id and p.club_id = public.current_club_id())
);
create policy "authors or admins can insert attachments" on public.post_attachments for insert to authenticated with check (
  exists (
    select 1 from public.posts p
    where p.id = post_attachments.post_id
      and post_attachments.file_path like p.club_id::text || '/' || p.id::text || '/%'
      and (p.author_id = public.current_member_id() or public.is_club_admin(p.club_id))
  )
);

create or replace view public.member_round_totals
with (security_invoker = true) as
select
  rp.id as round_player_id,
  r.id as round_id,
  r.club_id,
  r.played_on,
  r.course_name,
  m.id as member_id,
  m.name as member_name,
  sum(hs.strokes)::int as total_strokes
from public.round_players rp
join public.rounds r on r.id = rp.round_id
join public.members m on m.id = rp.member_id
join public.hole_scores hs on hs.round_player_id = rp.id
group by rp.id, r.id, r.club_id, r.played_on, r.course_name, m.id, m.name;

create or replace view public.member_score_stats
with (security_invoker = true) as
select
  member_id,
  member_name,
  count(*)::int as rounds_count,
  round(avg(total_strokes)::numeric, 1) as avg_score,
  min(total_strokes)::int as best_score
from public.member_round_totals
group by member_id, member_name;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true), ('post-images', 'post-images', false)
on conflict (id) do nothing;

create policy "members can upload own avatar" on storage.objects for insert to authenticated with check (
  bucket_id = 'avatars' and (storage.foldername(name))[1] = public.current_member_id()::text
);
create policy "members can manage own avatar" on storage.objects for update to authenticated using (
  bucket_id = 'avatars' and (storage.foldername(name))[1] = public.current_member_id()::text
) with check (
  bucket_id = 'avatars' and (storage.foldername(name))[1] = public.current_member_id()::text
);
create policy "club members can read post images" on storage.objects for select to authenticated using (
  bucket_id = 'post-images' and (storage.foldername(name))[1] = public.current_club_id()::text
);
create policy "club members can upload post images" on storage.objects for insert to authenticated with check (
  bucket_id = 'post-images' and (storage.foldername(name))[1] = public.current_club_id()::text
);
create policy "admins can delete club post images" on storage.objects for delete to authenticated using (
  bucket_id = 'post-images'
  and (storage.foldername(name))[1] ~* '^[0-9a-f-]{36}$'
  and public.is_club_admin((storage.foldername(name))[1]::uuid)
);

```


---

## `supabase/migrations/0002_member_account_claim.sql`

```sql
-- =========================================================
-- ParkBuddy member account claim migration
-- Purpose:
--   Safely connect authenticated Kakao users to pre-registered club members.
--
-- Security goals:
--   1. Do not trust client-provided user_id or club_id.
--   2. Store claim codes as hashes, never as plain text.
--   3. Allow claim code to be used only once.
--   4. Expire claim codes.
--   5. Prevent one auth user from claiming multiple member rows.
-- =========================================================

create extension if not exists "pgcrypto";

alter table public.members
add column if not exists claim_code_hash text,
add column if not exists claim_code_expires_at timestamptz,
add column if not exists claimed_at timestamptz;

create or replace function public.normalize_phone(input text)
returns text
language sql
immutable
as $$
  select regexp_replace(coalesce(input, ''), '\D', '', 'g')
$$;

create or replace function public.claim_member_account(
  p_name text,
  p_phone text,
  p_claim_code text
)
returns public.members
language plpgsql
security definer
set search_path = public
as $$
declare
  v_member public.members;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  if exists (
    select 1
    from public.members
    where user_id = auth.uid()
      and status = 'active'
  ) then
    raise exception 'ALREADY_CLAIMED';
  end if;

  if length(trim(coalesce(p_name, ''))) < 2 then
    raise exception 'INVALID_NAME';
  end if;

  if length(public.normalize_phone(p_phone)) < 8 then
    raise exception 'INVALID_PHONE';
  end if;

  if length(trim(coalesce(p_claim_code, ''))) < 6 then
    raise exception 'INVALID_CLAIM_CODE';
  end if;

  select *
  into v_member
  from public.members
  where user_id is null
    and status = 'active'
    and lower(trim(name)) = lower(trim(p_name))
    and public.normalize_phone(phone) = public.normalize_phone(p_phone)
    and claim_code_hash is not null
    and claim_code_expires_at > now()
    and claim_code_hash = crypt(trim(p_claim_code), claim_code_hash)
  limit 1
  for update;

  if not found then
    raise exception 'CLAIM_FAILED';
  end if;

  update public.members
  set
    user_id = auth.uid(),
    claim_code_hash = null,
    claim_code_expires_at = null,
    claimed_at = now(),
    updated_at = now()
  where id = v_member.id
  returning * into v_member;

  return v_member;
end;
$$;

revoke all on function public.claim_member_account(text, text, text) from public;
grant execute on function public.claim_member_account(text, text, text) to authenticated;

-- =========================================================
-- Optional initial seed for local development.
-- Run only if the club/member does not exist yet.
--
-- Test claim info:
--   name: 운영자
--   phone: 01012345678
--   claim code: 123456
-- =========================================================

insert into public.clubs (name, invite_code)
values ('파크버디 동호회', 'PARKBUDDY')
on conflict (invite_code) do nothing;

insert into public.members (
  club_id,
  name,
  phone,
  handicap,
  role,
  status,
  claim_code_hash,
  claim_code_expires_at
)
select
  c.id,
  '운영자',
  '01012345678',
  0,
  'admin',
  'active',
  crypt('123456', gen_salt('bf')),
  now() + interval '7 days'
from public.clubs c
where c.invite_code = 'PARKBUDDY'
  and not exists (
    select 1
    from public.members m
    where m.club_id = c.id
      and public.normalize_phone(m.phone) = public.normalize_phone('01012345678')
  );
```


---

## `supabase/migrations/0003_reset_admin_claim_code.sql`

```sql
-- =========================================================
-- ParkBuddy development repair migration
-- File: supabase/migrations/0003_reset_admin_claim_code.sql
--
-- Purpose:
--   Reissue the initial admin member claim code for local development.
--
-- Test claim info:
--   name: 운영자
--   phone: 01012345678
--   claim code: 123456
--
-- Important:
--   This script resets user_id and claimed_at for the test admin member.
--   Use this only in local/development setup.
-- =========================================================

create extension if not exists "pgcrypto";

alter table public.members
add column if not exists claim_code_hash text,
add column if not exists claim_code_expires_at timestamptz,
add column if not exists claimed_at timestamptz;

create or replace function public.normalize_phone(input text)
returns text
language sql
immutable
as $$
  select regexp_replace(coalesce(input, ''), '\D', '', 'g')
$$;

insert into public.clubs (name, invite_code)
values ('파크버디 동호회', 'PARKBUDDY')
on conflict (invite_code) do nothing;

do $$
declare
  v_club_id uuid;
  v_member_id uuid;
begin
  select id
  into v_club_id
  from public.clubs
  where invite_code = 'PARKBUDDY'
  limit 1;

  if v_club_id is null then
    raise exception 'PARKBUDDY club was not created.';
  end if;

  update public.members
  set
    name = '운영자',
    phone = '01012345678',
    handicap = 0,
    role = 'admin',
    status = 'active',
    user_id = null,
    claimed_at = null,
    claim_code_hash = crypt('123456', gen_salt('bf')),
    claim_code_expires_at = now() + interval '7 days',
    updated_at = now()
  where club_id = v_club_id
    and (
      public.normalize_phone(phone) = public.normalize_phone('01012345678')
      or lower(trim(name)) = lower(trim('운영자'))
    )
  returning id into v_member_id;

  if v_member_id is null then
    insert into public.members (
      club_id,
      name,
      phone,
      handicap,
      role,
      status,
      user_id,
      claimed_at,
      claim_code_hash,
      claim_code_expires_at
    )
    values (
      v_club_id,
      '운영자',
      '01012345678',
      0,
      'admin',
      'active',
      null,
      null,
      crypt('123456', gen_salt('bf')),
      now() + interval '7 days'
    )
    returning id into v_member_id;
  end if;
end $$;
```


---

## `supabase/migrations/0004_debug_and_repair_member_claim.sql`

```sql

```


---

## `supabase/migrations/0005_fix_pgcrypto_schema_for_member_claim.sql`

```sql
-- =========================================================
-- ParkBuddy pgcrypto schema fix for member claim
-- File: supabase/migrations/0005_fix_pgcrypto_schema_for_member_claim.sql
--
-- Purpose:
--   Fix "function crypt(text, text) does not exist" in Supabase.
--
-- Why this happens:
--   In Supabase, pgcrypto functions such as crypt() and gen_salt()
--   are usually installed in the extensions schema.
--
--   Our security definer RPC uses:
--     set search_path = public
--
--   This is safer than relying on a broad search_path, but it means
--   unqualified calls like crypt(...) cannot find extensions.crypt(...).
--
-- Fix:
--   Use explicit schema-qualified function calls:
--     extensions.crypt(...)
--     extensions.gen_salt(...)
--
-- Development test claim info:
--   name: 운영자
--   phone: 01012345678
--   claim code: 123456
--
-- Important:
--   This script resets the development test admin member claim state.
--   Do not run this blindly in production.
-- =========================================================

create extension if not exists "pgcrypto" with schema extensions;

alter table public.members
add column if not exists claim_code_hash text,
add column if not exists claim_code_expires_at timestamptz,
add column if not exists claimed_at timestamptz;

create or replace function public.normalize_phone(input text)
returns text
language sql
immutable
set search_path = public
as $$
  select regexp_replace(coalesce(input, ''), '\D', '', 'g')
$$;

create or replace function public.claim_member_account(
  p_name text,
  p_phone text,
  p_claim_code text
)
returns public.members
language plpgsql
security definer
set search_path = public
as $$
declare
  v_member public.members;
  v_existing_member public.members;
  v_normalized_phone text;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select *
  into v_existing_member
  from public.members
  where user_id = auth.uid()
    and status = 'active'
  limit 1;

  if found then
    raise exception 'ALREADY_CLAIMED';
  end if;

  if length(trim(coalesce(p_name, ''))) < 2 then
    raise exception 'INVALID_NAME';
  end if;

  v_normalized_phone := public.normalize_phone(p_phone);

  if length(v_normalized_phone) < 8 then
    raise exception 'INVALID_PHONE';
  end if;

  if length(trim(coalesce(p_claim_code, ''))) < 6 then
    raise exception 'INVALID_CLAIM_CODE';
  end if;

  select *
  into v_member
  from public.members
  where user_id is null
    and status = 'active'
    and lower(trim(name)) = lower(trim(p_name))
    and public.normalize_phone(phone) = v_normalized_phone
    and claim_code_hash is not null
    and claim_code_expires_at is not null
    and claim_code_expires_at > now()
    and claim_code_hash = extensions.crypt(trim(p_claim_code), claim_code_hash)
  order by created_at desc
  limit 1
  for update;

  if not found then
    raise exception 'CLAIM_FAILED';
  end if;

  update public.members
  set
    user_id = auth.uid(),
    claim_code_hash = null,
    claim_code_expires_at = null,
    claimed_at = now(),
    updated_at = now()
  where id = v_member.id
  returning * into v_member;

  return v_member;
end;
$$;

revoke all on function public.claim_member_account(text, text, text) from public;
grant execute on function public.claim_member_account(text, text, text) to authenticated;

insert into public.clubs (name, invite_code)
values ('파크버디 동호회', 'PARKBUDDY')
on conflict (invite_code) do nothing;

do $$
declare
  v_club_id uuid;
  v_target_member_id uuid;
begin
  select id
  into v_club_id
  from public.clubs
  where invite_code = 'PARKBUDDY'
  limit 1;

  if v_club_id is null then
    raise exception 'PARKBUDDY club was not created.';
  end if;

  select id
  into v_target_member_id
  from public.members
  where club_id = v_club_id
    and public.normalize_phone(phone) = public.normalize_phone('01012345678')
  order by created_at desc
  limit 1;

  if v_target_member_id is null then
    select id
    into v_target_member_id
    from public.members
    where club_id = v_club_id
      and lower(trim(name)) = lower(trim('운영자'))
    order by created_at desc
    limit 1;
  end if;

  if v_target_member_id is null then
    insert into public.members (
      club_id,
      name,
      phone,
      handicap,
      role,
      status,
      user_id,
      claimed_at,
      claim_code_hash,
      claim_code_expires_at
    )
    values (
      v_club_id,
      '운영자',
      '01012345678',
      0,
      'admin',
      'active',
      null,
      null,
      extensions.crypt('123456', extensions.gen_salt('bf')),
      now() + interval '7 days'
    )
    returning id into v_target_member_id;
  end if;

  update public.members
  set
    name = '운영자',
    phone = '01012345678',
    handicap = 0,
    role = 'admin',
    status = 'active',
    user_id = null,
    claimed_at = null,
    claim_code_hash = extensions.crypt('123456', extensions.gen_salt('bf')),
    claim_code_expires_at = now() + interval '7 days',
    updated_at = now()
  where id = v_target_member_id;

  update public.members
  set
    status = 'inactive',
    user_id = null,
    claimed_at = null,
    claim_code_hash = null,
    claim_code_expires_at = null,
    updated_at = now()
  where club_id = v_club_id
    and id <> v_target_member_id
    and (
      public.normalize_phone(phone) = public.normalize_phone('01012345678')
      or lower(trim(name)) = lower(trim('운영자'))
    );
end $$;

select
  m.id,
  c.name as club_name,
  c.invite_code,
  m.name,
  m.phone,
  public.normalize_phone(m.phone) as normalized_phone,
  m.role,
  m.status,
  m.user_id,
  m.claimed_at,
  m.claim_code_hash is not null as has_claim_code,
  m.claim_code_expires_at,
  m.claim_code_expires_at > now() as claim_code_is_valid,
  case
    when m.claim_code_hash is null then false
    else m.claim_code_hash = extensions.crypt('123456', m.claim_code_hash)
  end as claim_code_123456_matches
from public.members m
join public.clubs c on c.id = m.club_id
where c.invite_code = 'PARKBUDDY'
order by
  case when m.status = 'active' then 0 else 1 end,
  m.created_at desc;
```


---

## `supabase/migrations/0006_admin_member_management.sql`

```sql
-- =========================================================
-- ParkBuddy admin member management migration
-- File: supabase/migrations/0006_admin_member_management.sql
--
-- Purpose:
--   Allow club admins to create members and reissue claim codes
--   without using Supabase SQL Editor manually.
--
-- Security goals:
--   1. Never trust client-provided club_id.
--   2. Only active admins can create members.
--   3. Claim codes are generated inside DB and stored as hashes.
--   4. Plain claim code is returned only once to the admin.
--   5. Claim code cannot be reissued for already linked members.
-- =========================================================

create extension if not exists "pgcrypto" with schema extensions;

alter table public.members
add column if not exists claim_code_hash text,
add column if not exists claim_code_expires_at timestamptz,
add column if not exists claimed_at timestamptz;

create or replace function public.generate_member_claim_code()
returns text
language sql
volatile
set search_path = public
as $$
  select upper(substr(encode(extensions.gen_random_bytes(8), 'hex'), 1, 8))
$$;

create or replace function public.admin_create_member(
  p_name text,
  p_phone text,
  p_handicap numeric default 0,
  p_role text default 'member'
)
returns table (
  member_id uuid,
  member_name text,
  member_phone text,
  member_role text,
  claim_code text,
  claim_code_expires_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin public.members;
  v_claim_code text;
  v_member public.members;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select *
  into v_admin
  from public.members
  where user_id = auth.uid()
    and role = 'admin'
    and status = 'active'
  limit 1;

  if not found then
    raise exception 'ADMIN_REQUIRED';
  end if;

  if length(trim(coalesce(p_name, ''))) < 2 then
    raise exception 'INVALID_NAME';
  end if;

  if length(public.normalize_phone(p_phone)) < 8 then
    raise exception 'INVALID_PHONE';
  end if;

  if p_role not in ('member', 'admin') then
    raise exception 'INVALID_ROLE';
  end if;

  if p_handicap < -100 or p_handicap > 200 then
    raise exception 'INVALID_HANDICAP';
  end if;

  if exists (
    select 1
    from public.members m
    where m.club_id = v_admin.club_id
      and public.normalize_phone(m.phone) = public.normalize_phone(p_phone)
      and m.status <> 'inactive'
  ) then
    raise exception 'DUPLICATE_PHONE';
  end if;

  v_claim_code := public.generate_member_claim_code();

  insert into public.members (
    club_id,
    name,
    phone,
    handicap,
    role,
    status,
    user_id,
    claimed_at,
    claim_code_hash,
    claim_code_expires_at
  )
  values (
    v_admin.club_id,
    trim(p_name),
    public.normalize_phone(p_phone),
    p_handicap,
    p_role,
    'active',
    null,
    null,
    extensions.crypt(v_claim_code, extensions.gen_salt('bf')),
    now() + interval '7 days'
  )
  returning * into v_member;

  return query
  select
    v_member.id,
    v_member.name,
    v_member.phone,
    v_member.role,
    v_claim_code,
    v_member.claim_code_expires_at;
end;
$$;

create or replace function public.admin_reissue_member_claim_code(
  p_member_id uuid
)
returns table (
  member_id uuid,
  member_name text,
  member_phone text,
  claim_code text,
  claim_code_expires_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin public.members;
  v_target public.members;
  v_claim_code text;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select *
  into v_admin
  from public.members
  where user_id = auth.uid()
    and role = 'admin'
    and status = 'active'
  limit 1;

  if not found then
    raise exception 'ADMIN_REQUIRED';
  end if;

  select *
  into v_target
  from public.members
  where id = p_member_id
    and club_id = v_admin.club_id
    and status = 'active'
  limit 1
  for update;

  if not found then
    raise exception 'MEMBER_NOT_FOUND';
  end if;

  if v_target.user_id is not null then
    raise exception 'MEMBER_ALREADY_LINKED';
  end if;

  v_claim_code := public.generate_member_claim_code();

  update public.members
  set
    claim_code_hash = extensions.crypt(v_claim_code, extensions.gen_salt('bf')),
    claim_code_expires_at = now() + interval '7 days',
    claimed_at = null,
    updated_at = now()
  where id = v_target.id
  returning * into v_target;

  return query
  select
    v_target.id,
    v_target.name,
    v_target.phone,
    v_claim_code,
    v_target.claim_code_expires_at;
end;
$$;

revoke all on function public.generate_member_claim_code() from public;
revoke all on function public.admin_create_member(text, text, numeric, text) from public;
revoke all on function public.admin_reissue_member_claim_code(uuid) from public;

grant execute on function public.admin_create_member(text, text, numeric, text) to authenticated;
grant execute on function public.admin_reissue_member_claim_code(uuid) to authenticated;
```


---

## `supabase/migrations/0007_admin_update_member.sql`

```sql
-- =========================================================
-- ParkBuddy admin member update migration
-- File: supabase/migrations/0007_admin_update_member.sql
--
-- Purpose:
--   Allow club admins to update active members safely.
--
-- Security goals:
--   1. Never trust client-provided club_id.
--   2. Only active admins can update members in their own club.
--   3. Prevent duplicate active phone numbers in the same club.
--   4. Prevent an admin from demoting their own admin role.
--   5. Prevent removing the last admin role in a club.
-- =========================================================

create or replace function public.admin_update_member(
  p_member_id uuid,
  p_name text,
  p_phone text,
  p_handicap numeric default 0,
  p_role text default 'member'
)
returns public.members
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin public.members;
  v_target public.members;
  v_admin_count integer;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select *
  into v_admin
  from public.members
  where user_id = auth.uid()
    and role = 'admin'
    and status = 'active'
  limit 1;

  if not found then
    raise exception 'ADMIN_REQUIRED';
  end if;

  select *
  into v_target
  from public.members
  where id = p_member_id
    and club_id = v_admin.club_id
    and status = 'active'
  limit 1
  for update;

  if not found then
    raise exception 'MEMBER_NOT_FOUND';
  end if;

  if length(trim(coalesce(p_name, ''))) < 2 then
    raise exception 'INVALID_NAME';
  end if;

  if length(public.normalize_phone(p_phone)) < 8 then
    raise exception 'INVALID_PHONE';
  end if;

  if p_role not in ('member', 'admin') then
    raise exception 'INVALID_ROLE';
  end if;

  if p_handicap < -100 or p_handicap > 200 then
    raise exception 'INVALID_HANDICAP';
  end if;

  if exists (
    select 1
    from public.members m
    where m.club_id = v_admin.club_id
      and m.id <> v_target.id
      and public.normalize_phone(m.phone) = public.normalize_phone(p_phone)
      and m.status <> 'inactive'
  ) then
    raise exception 'DUPLICATE_PHONE';
  end if;

  if v_target.id = v_admin.id and p_role <> 'admin' then
    raise exception 'CANNOT_DEMOTE_SELF';
  end if;

  if v_target.role = 'admin' and p_role <> 'admin' then
    select count(*)
    into v_admin_count
    from public.members m
    where m.club_id = v_admin.club_id
      and m.role = 'admin'
      and m.status = 'active';

    if v_admin_count <= 1 then
      raise exception 'LAST_ADMIN_REQUIRED';
    end if;
  end if;

  update public.members
  set
    name = trim(p_name),
    phone = public.normalize_phone(p_phone),
    handicap = p_handicap,
    role = p_role,
    updated_at = now()
  where id = v_target.id
  returning * into v_target;

  return v_target;
end;
$$;

revoke all on function public.admin_update_member(uuid, text, text, numeric, text) from public;
grant execute on function public.admin_update_member(uuid, text, text, numeric, text) to authenticated;

```


---

## `supabase/migrations/0008_admin_deactivate_member.sql`

```sql
-- =========================================================
-- ParkBuddy admin member deactivate migration
-- File: supabase/migrations/0008_admin_deactivate_member.sql
--
-- Purpose:
--   Allow club admins to deactivate active members safely.
--
-- Security goals:
--   1. Never trust client-provided club_id.
--   2. Only active admins can deactivate members in their own club.
--   3. Prevent an admin from deactivating themself.
--   4. Prevent deactivating the last active admin in a club.
--   5. Do not hard-delete member rows.
-- =========================================================

create or replace function public.admin_deactivate_member(
  p_member_id uuid
)
returns public.members
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin public.members;
  v_target public.members;
  v_admin_count integer;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select *
  into v_admin
  from public.members
  where user_id = auth.uid()
    and role = 'admin'
    and status = 'active'
  limit 1;

  if not found then
    raise exception 'ADMIN_REQUIRED';
  end if;

  select *
  into v_target
  from public.members
  where id = p_member_id
    and club_id = v_admin.club_id
    and status = 'active'
  limit 1
  for update;

  if not found then
    raise exception 'MEMBER_NOT_FOUND';
  end if;

  if v_target.id = v_admin.id then
    raise exception 'CANNOT_DEACTIVATE_SELF';
  end if;

  if v_target.role = 'admin' then
    select count(*)
    into v_admin_count
    from public.members m
    where m.club_id = v_admin.club_id
      and m.role = 'admin'
      and m.status = 'active';

    if v_admin_count <= 1 then
      raise exception 'LAST_ADMIN_REQUIRED';
    end if;
  end if;

  update public.members
  set
    status = 'inactive',
    claim_code_hash = null,
    claim_code_expires_at = null,
    updated_at = now()
  where id = v_target.id
  returning * into v_target;

  return v_target;
end;
$$;

revoke all on function public.admin_deactivate_member(uuid) from public;
grant execute on function public.admin_deactivate_member(uuid) to authenticated;

```


---

## `supabase/migrations/0009_admin_action_logs.sql`

```sql
-- =========================================================
-- ParkBuddy admin action logs migration
-- File: supabase/migrations/0009_admin_action_logs.sql
--
-- Purpose:
--   Record important admin actions for auditability.
--
-- Security goals:
--   1. Logs are append-only from application flows.
--   2. Users can read logs only for their own club.
--   3. Admin RPC functions write logs inside the same DB transaction.
--   4. Sensitive claim code plaintext is never written to logs.
-- =========================================================

create table if not exists public.admin_action_logs (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  actor_member_id uuid references public.members(id) on delete set null,
  target_member_id uuid references public.members(id) on delete set null,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.admin_action_logs enable row level security;

drop policy if exists "club members can read same club admin action logs"
on public.admin_action_logs;

create policy "club members can read same club admin action logs"
on public.admin_action_logs
for select
to authenticated
using (
  exists (
    select 1
    from public.members m
    where m.user_id = auth.uid()
      and m.club_id = admin_action_logs.club_id
      and m.status = 'active'
  )
);

create index if not exists admin_action_logs_club_created_idx
on public.admin_action_logs (club_id, created_at desc);

create index if not exists admin_action_logs_target_member_idx
on public.admin_action_logs (target_member_id, created_at desc);

create or replace function public.admin_log_action(
  p_club_id uuid,
  p_actor_member_id uuid,
  p_target_member_id uuid,
  p_action text,
  p_metadata jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_action is null or length(trim(p_action)) < 2 then
    raise exception 'INVALID_ADMIN_ACTION';
  end if;

  insert into public.admin_action_logs (
    club_id,
    actor_member_id,
    target_member_id,
    action,
    metadata
  )
  values (
    p_club_id,
    p_actor_member_id,
    p_target_member_id,
    trim(p_action),
    coalesce(p_metadata, '{}'::jsonb)
  );
end;
$$;

revoke all on function public.admin_log_action(uuid, uuid, uuid, text, jsonb) from public;

create or replace function public.admin_create_member(
  p_name text,
  p_phone text,
  p_handicap numeric default 0,
  p_role text default 'member'
)
returns table (
  member_id uuid,
  member_name text,
  member_phone text,
  member_role text,
  claim_code text,
  claim_code_expires_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin public.members;
  v_claim_code text;
  v_member public.members;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select *
  into v_admin
  from public.members
  where user_id = auth.uid()
    and role = 'admin'
    and status = 'active'
  limit 1;

  if not found then
    raise exception 'ADMIN_REQUIRED';
  end if;

  if length(trim(coalesce(p_name, ''))) < 2 then
    raise exception 'INVALID_NAME';
  end if;

  if length(public.normalize_phone(p_phone)) < 8 then
    raise exception 'INVALID_PHONE';
  end if;

  if p_role not in ('member', 'admin') then
    raise exception 'INVALID_ROLE';
  end if;

  if p_handicap < -100 or p_handicap > 200 then
    raise exception 'INVALID_HANDICAP';
  end if;

  if exists (
    select 1
    from public.members m
    where m.club_id = v_admin.club_id
      and public.normalize_phone(m.phone) = public.normalize_phone(p_phone)
      and m.status <> 'inactive'
  ) then
    raise exception 'DUPLICATE_PHONE';
  end if;

  v_claim_code := public.generate_member_claim_code();

  insert into public.members (
    club_id,
    name,
    phone,
    handicap,
    role,
    status,
    user_id,
    claimed_at,
    claim_code_hash,
    claim_code_expires_at
  )
  values (
    v_admin.club_id,
    trim(p_name),
    public.normalize_phone(p_phone),
    p_handicap,
    p_role,
    'active',
    null,
    null,
    extensions.crypt(v_claim_code, extensions.gen_salt('bf')),
    now() + interval '7 days'
  )
  returning * into v_member;

  perform public.admin_log_action(
    v_admin.club_id,
    v_admin.id,
    v_member.id,
    'member.create',
    jsonb_build_object(
      'member_name', v_member.name,
      'member_role', v_member.role
    )
  );

  return query
  select
    v_member.id,
    v_member.name,
    v_member.phone,
    v_member.role,
    v_claim_code,
    v_member.claim_code_expires_at;
end;
$$;

create or replace function public.admin_reissue_member_claim_code(
  p_member_id uuid
)
returns table (
  member_id uuid,
  member_name text,
  member_phone text,
  claim_code text,
  claim_code_expires_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin public.members;
  v_target public.members;
  v_claim_code text;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select *
  into v_admin
  from public.members
  where user_id = auth.uid()
    and role = 'admin'
    and status = 'active'
  limit 1;

  if not found then
    raise exception 'ADMIN_REQUIRED';
  end if;

  select *
  into v_target
  from public.members
  where id = p_member_id
    and club_id = v_admin.club_id
    and status = 'active'
  limit 1
  for update;

  if not found then
    raise exception 'MEMBER_NOT_FOUND';
  end if;

  if v_target.user_id is not null then
    raise exception 'MEMBER_ALREADY_LINKED';
  end if;

  v_claim_code := public.generate_member_claim_code();

  update public.members
  set
    claim_code_hash = extensions.crypt(v_claim_code, extensions.gen_salt('bf')),
    claim_code_expires_at = now() + interval '7 days',
    claimed_at = null,
    updated_at = now()
  where id = v_target.id
  returning * into v_target;

  perform public.admin_log_action(
    v_admin.club_id,
    v_admin.id,
    v_target.id,
    'member.claim_code.reissue',
    jsonb_build_object('member_name', v_target.name)
  );

  return query
  select
    v_target.id,
    v_target.name,
    v_target.phone,
    v_claim_code,
    v_target.claim_code_expires_at;
end;
$$;

create or replace function public.admin_update_member(
  p_member_id uuid,
  p_name text,
  p_phone text,
  p_handicap numeric default 0,
  p_role text default 'member'
)
returns public.members
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin public.members;
  v_target public.members;
  v_before public.members;
  v_admin_count integer;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select *
  into v_admin
  from public.members
  where user_id = auth.uid()
    and role = 'admin'
    and status = 'active'
  limit 1;

  if not found then
    raise exception 'ADMIN_REQUIRED';
  end if;

  select *
  into v_target
  from public.members
  where id = p_member_id
    and club_id = v_admin.club_id
    and status = 'active'
  limit 1
  for update;

  if not found then
    raise exception 'MEMBER_NOT_FOUND';
  end if;

  v_before := v_target;

  if length(trim(coalesce(p_name, ''))) < 2 then
    raise exception 'INVALID_NAME';
  end if;

  if length(public.normalize_phone(p_phone)) < 8 then
    raise exception 'INVALID_PHONE';
  end if;

  if p_role not in ('member', 'admin') then
    raise exception 'INVALID_ROLE';
  end if;

  if p_handicap < -100 or p_handicap > 200 then
    raise exception 'INVALID_HANDICAP';
  end if;

  if exists (
    select 1
    from public.members m
    where m.club_id = v_admin.club_id
      and m.id <> v_target.id
      and public.normalize_phone(m.phone) = public.normalize_phone(p_phone)
      and m.status <> 'inactive'
  ) then
    raise exception 'DUPLICATE_PHONE';
  end if;

  if v_target.id = v_admin.id and p_role <> 'admin' then
    raise exception 'CANNOT_DEMOTE_SELF';
  end if;

  if v_target.role = 'admin' and p_role <> 'admin' then
    select count(*)
    into v_admin_count
    from public.members m
    where m.club_id = v_admin.club_id
      and m.role = 'admin'
      and m.status = 'active';

    if v_admin_count <= 1 then
      raise exception 'LAST_ADMIN_REQUIRED';
    end if;
  end if;

  update public.members
  set
    name = trim(p_name),
    phone = public.normalize_phone(p_phone),
    handicap = p_handicap,
    role = p_role,
    updated_at = now()
  where id = v_target.id
  returning * into v_target;

  perform public.admin_log_action(
    v_admin.club_id,
    v_admin.id,
    v_target.id,
    'member.update',
    jsonb_build_object(
      'before', jsonb_build_object(
        'name', v_before.name,
        'phone', v_before.phone,
        'handicap', v_before.handicap,
        'role', v_before.role
      ),
      'after', jsonb_build_object(
        'name', v_target.name,
        'phone', v_target.phone,
        'handicap', v_target.handicap,
        'role', v_target.role
      )
    )
  );

  return v_target;
end;
$$;

create or replace function public.admin_deactivate_member(
  p_member_id uuid
)
returns public.members
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin public.members;
  v_target public.members;
  v_admin_count integer;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select *
  into v_admin
  from public.members
  where user_id = auth.uid()
    and role = 'admin'
    and status = 'active'
  limit 1;

  if not found then
    raise exception 'ADMIN_REQUIRED';
  end if;

  select *
  into v_target
  from public.members
  where id = p_member_id
    and club_id = v_admin.club_id
    and status = 'active'
  limit 1
  for update;

  if not found then
    raise exception 'MEMBER_NOT_FOUND';
  end if;

  if v_target.id = v_admin.id then
    raise exception 'CANNOT_DEACTIVATE_SELF';
  end if;

  if v_target.role = 'admin' then
    select count(*)
    into v_admin_count
    from public.members m
    where m.club_id = v_admin.club_id
      and m.role = 'admin'
      and m.status = 'active';

    if v_admin_count <= 1 then
      raise exception 'LAST_ADMIN_REQUIRED';
    end if;
  end if;

  update public.members
  set
    status = 'inactive',
    claim_code_hash = null,
    claim_code_expires_at = null,
    updated_at = now()
  where id = v_target.id
  returning * into v_target;

  perform public.admin_log_action(
    v_admin.club_id,
    v_admin.id,
    v_target.id,
    'member.deactivate',
    jsonb_build_object(
      'member_name', v_target.name,
      'member_role', v_target.role
    )
  );

  return v_target;
end;
$$;

revoke all on function public.admin_create_member(text, text, numeric, text) from public;
revoke all on function public.admin_reissue_member_claim_code(uuid) from public;
revoke all on function public.admin_update_member(uuid, text, text, numeric, text) from public;
revoke all on function public.admin_deactivate_member(uuid) from public;

grant execute on function public.admin_create_member(text, text, numeric, text) to authenticated;
grant execute on function public.admin_reissue_member_claim_code(uuid) to authenticated;
grant execute on function public.admin_update_member(uuid, text, text, numeric, text) to authenticated;
grant execute on function public.admin_deactivate_member(uuid) to authenticated;

```


---

## `supabase/migrations/0010_admin_restore_member.sql`

```sql
-- =========================================================
-- ParkBuddy admin restore member migration
-- File: supabase/migrations/0010_admin_restore_member.sql
--
-- Purpose:
--   Allow club admins to restore inactive members safely.
--
-- Security goals:
--   1. Never trust client-provided club_id.
--   2. Only active admins can restore members in their own club.
--   3. Prevent restoring a member when their phone number conflicts
--      with another active member in the same club.
--   4. Do not recreate claim codes automatically during restore.
--      Admins can reissue a claim code after restore when needed.
-- =========================================================

create or replace function public.admin_restore_member(
  p_member_id uuid
)
returns public.members
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin public.members;
  v_target public.members;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select *
  into v_admin
  from public.members
  where user_id = auth.uid()
    and role = 'admin'
    and status = 'active'
  limit 1;

  if not found then
    raise exception 'ADMIN_REQUIRED';
  end if;

  select *
  into v_target
  from public.members
  where id = p_member_id
    and club_id = v_admin.club_id
    and status = 'inactive'
  limit 1
  for update;

  if not found then
    raise exception 'MEMBER_NOT_FOUND';
  end if;

  if exists (
    select 1
    from public.members m
    where m.club_id = v_admin.club_id
      and m.id <> v_target.id
      and m.status = 'active'
      and public.normalize_phone(m.phone) = public.normalize_phone(v_target.phone)
  ) then
    raise exception 'DUPLICATE_PHONE';
  end if;

  update public.members
  set
    status = 'active',
    updated_at = now()
  where id = v_target.id
  returning * into v_target;

  -- Core audit logic: never store sensitive claim code plaintext in logs.
  perform public.admin_log_action(
    v_admin.club_id,
    v_admin.id,
    v_target.id,
    'member.restore',
    jsonb_build_object(
      'member_name', v_target.name,
      'member_role', v_target.role
    )
  );

  return v_target;
end;
$$;

revoke all on function public.admin_restore_member(uuid) from public;
grant execute on function public.admin_restore_member(uuid) to authenticated;

```


---

## `supabase/migrations/0011_rounds_base.sql`

```sql
-- =========================================================
-- ParkBuddy rounds base migration v2
-- File: supabase/migrations/0011_rounds_base.sql
--
-- Purpose:
--   Create or repair the base rounds table and admin_create_round RPC.
--
-- Why v2:
--   Some projects may already have a partial rounds table.
--   This migration is intentionally idempotent and adds missing columns
--   instead of assuming a fresh table.
-- =========================================================

create table if not exists public.rounds (
  id uuid primary key default gen_random_uuid()
);

alter table public.rounds
  add column if not exists club_id uuid references public.clubs(id) on delete cascade,
  add column if not exists title text,
  add column if not exists course_name text,
  add column if not exists play_date date,
  add column if not exists start_time time,
  add column if not exists memo text,
  add column if not exists status text not null default 'scheduled',
  add column if not exists created_by_member_id uuid references public.members(id) on delete set null,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

update public.rounds
set status = 'scheduled'
where status is null;

alter table public.rounds
  alter column status set default 'scheduled',
  alter column status set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'rounds_status_check'
      and conrelid = 'public.rounds'::regclass
  ) then
    alter table public.rounds
      add constraint rounds_status_check
      check (status in ('scheduled', 'completed', 'cancelled'));
  end if;
end;
$$;

create index if not exists rounds_club_play_date_idx
on public.rounds (club_id, play_date desc, created_at desc);

alter table public.rounds enable row level security;

drop policy if exists "club members can read same club rounds"
on public.rounds;

create policy "club members can read same club rounds"
on public.rounds
for select
to authenticated
using (
  exists (
    select 1
    from public.members m
    where m.user_id = auth.uid()
      and m.club_id = rounds.club_id
      and m.status = 'active'
  )
);

create or replace function public.admin_create_round(
  p_title text,
  p_course_name text,
  p_play_date date,
  p_start_time time default null,
  p_memo text default null
)
returns public.rounds
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin public.members;
  v_round public.rounds;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select *
  into v_admin
  from public.members
  where user_id = auth.uid()
    and role = 'admin'
    and status = 'active'
  limit 1;

  if not found then
    raise exception 'ADMIN_REQUIRED';
  end if;

  if length(trim(coalesce(p_title, ''))) < 2 then
    raise exception 'INVALID_TITLE';
  end if;

  if length(trim(coalesce(p_course_name, ''))) < 2 then
    raise exception 'INVALID_COURSE_NAME';
  end if;

  if p_play_date is null then
    raise exception 'INVALID_PLAY_DATE';
  end if;

  insert into public.rounds (
    club_id,
    title,
    course_name,
    play_date,
    start_time,
    memo,
    status,
    created_by_member_id
  )
  values (
    v_admin.club_id,
    trim(p_title),
    trim(p_course_name),
    p_play_date,
    p_start_time,
    nullif(trim(coalesce(p_memo, '')), ''),
    'scheduled',
    v_admin.id
  )
  returning * into v_round;

  if to_regclass('public.admin_action_logs') is not null then
    perform public.admin_log_action(
      v_admin.club_id,
      v_admin.id,
      null,
      'round.create',
      jsonb_build_object(
        'round_id', v_round.id,
        'title', v_round.title,
        'course_name', v_round.course_name,
        'play_date', v_round.play_date
      )
    );
  end if;

  return v_round;
end;
$$;

revoke all on function public.admin_create_round(text, text, date, time, text) from public;
grant execute on function public.admin_create_round(text, text, date, time, text) to authenticated;

```


---

## `supabase/migrations/0012_round_participants.sql`

```sql
-- =========================================================
-- ParkBuddy round participants migration
-- File: supabase/migrations/0012_round_participants.sql
--
-- Purpose:
--   Allow club admins to select participants for a round.
--
-- Security goals:
--   1. Never trust client-provided club_id.
--   2. Only active admins can update participants for rounds in their club.
--   3. Only active members in the same club can be selected.
--   4. Participant updates are stored in one DB transaction.
-- =========================================================

create table if not exists public.round_participants (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  round_id uuid not null references public.rounds(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete cascade,
  status text not null default 'confirmed',
  team_no integer,
  position_no integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (round_id, member_id)
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'round_participants_status_check'
      and conrelid = 'public.round_participants'::regclass
  ) then
    alter table public.round_participants
      add constraint round_participants_status_check
      check (status in ('confirmed', 'cancelled'));
  end if;
end;
$$;

create index if not exists round_participants_round_idx
on public.round_participants (round_id, created_at);

create index if not exists round_participants_member_idx
on public.round_participants (member_id, created_at desc);

alter table public.round_participants enable row level security;

drop policy if exists "club members can read same club round participants"
on public.round_participants;

create policy "club members can read same club round participants"
on public.round_participants
for select
to authenticated
using (
  exists (
    select 1
    from public.members m
    where m.user_id = auth.uid()
      and m.club_id = round_participants.club_id
      and m.status = 'active'
  )
);

create or replace function public.admin_set_round_participants(
  p_round_id uuid,
  p_member_ids uuid[] default '{}'::uuid[]
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin public.members;
  v_round public.rounds;
  v_member_ids uuid[];
  v_invalid_count integer;
  v_participant_count integer;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select *
  into v_admin
  from public.members
  where user_id = auth.uid()
    and role = 'admin'
    and status = 'active'
  limit 1;

  if not found then
    raise exception 'ADMIN_REQUIRED';
  end if;

  select *
  into v_round
  from public.rounds
  where id = p_round_id
    and club_id = v_admin.club_id
  limit 1
  for update;

  if not found then
    raise exception 'ROUND_NOT_FOUND';
  end if;

  select array(
    select distinct member_id
    from unnest(coalesce(p_member_ids, '{}'::uuid[])) as member_id
    where member_id is not null
  )
  into v_member_ids;

  select count(*)
  into v_invalid_count
  from unnest(v_member_ids) as selected_member_id
  where not exists (
    select 1
    from public.members m
    where m.id = selected_member_id
      and m.club_id = v_admin.club_id
      and m.status = 'active'
  );

  if v_invalid_count > 0 then
    raise exception 'INVALID_PARTICIPANT';
  end if;

  delete from public.round_participants rp
  where rp.round_id = v_round.id
    and rp.club_id = v_admin.club_id
    and not (rp.member_id = any(v_member_ids));

  insert into public.round_participants (
    club_id,
    round_id,
    member_id,
    status
  )
  select
    v_admin.club_id,
    v_round.id,
    selected_member_id,
    'confirmed'
  from unnest(v_member_ids) as selected_member_id
  on conflict (round_id, member_id)
  do update set
    status = 'confirmed',
    updated_at = now();

  select count(*)
  into v_participant_count
  from public.round_participants rp
  where rp.round_id = v_round.id
    and rp.status = 'confirmed';

  if to_regprocedure('public.admin_log_action(uuid,uuid,uuid,text,jsonb)') is not null then
    perform public.admin_log_action(
      v_admin.club_id,
      v_admin.id,
      null,
      'round.participants.update',
      jsonb_build_object(
        'round_id', v_round.id,
        'round_title', v_round.title,
        'participant_count', v_participant_count
      )
    );
  end if;

  return v_participant_count;
end;
$$;

revoke all on function public.admin_set_round_participants(uuid, uuid[]) from public;
grant execute on function public.admin_set_round_participants(uuid, uuid[]) to authenticated;

```


---

## `supabase/migrations/0013_round_pairings.sql`

```sql
-- =========================================================
-- ParkBuddy round pairings migration
-- File: supabase/migrations/0013_round_pairings.sql
--
-- Purpose:
--   Store round game settings and group assignments.
--
-- Security goals:
--   1. Only active admins can save pairings for their own club rounds.
--   2. Only active participants of the round can be assigned to groups.
--   3. Each group must have 3 or 4 players.
--   4. Game type and scoring type combinations are validated in the DB.
-- =========================================================

alter table public.rounds
  add column if not exists game_type text,
  add column if not exists scoring_type text,
  add column if not exists pairings_updated_at timestamptz;

create table if not exists public.round_groups (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references public.rounds(id) on delete cascade,
  group_no integer not null,
  game_type text not null,
  scoring_type text not null,
  created_at timestamptz not null default now(),
  unique (round_id, group_no)
);

create table if not exists public.round_group_members (
  id uuid primary key default gen_random_uuid(),
  round_group_id uuid not null references public.round_groups(id) on delete cascade,
  round_id uuid not null references public.rounds(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete cascade,
  position integer not null default 1,
  created_at timestamptz not null default now(),
  unique (round_id, member_id)
);

create index if not exists round_groups_round_id_idx
on public.round_groups (round_id, group_no);

create index if not exists round_group_members_round_id_idx
on public.round_group_members (round_id, member_id);

alter table public.round_groups enable row level security;
alter table public.round_group_members enable row level security;

drop policy if exists "club members can read same club round groups"
on public.round_groups;

create policy "club members can read same club round groups"
on public.round_groups
for select
to authenticated
using (
  exists (
    select 1
    from public.rounds r
    join public.members m on m.club_id = r.club_id
    where r.id = round_groups.round_id
      and m.user_id = auth.uid()
      and m.status = 'active'
  )
);

drop policy if exists "club members can read same club round group members"
on public.round_group_members;

create policy "club members can read same club round group members"
on public.round_group_members
for select
to authenticated
using (
  exists (
    select 1
    from public.rounds r
    join public.members m on m.club_id = r.club_id
    where r.id = round_group_members.round_id
      and m.user_id = auth.uid()
      and m.status = 'active'
  )
);

create or replace function public.is_valid_round_game_combination(
  p_game_type text,
  p_scoring_type text
)
returns boolean
language sql
immutable
as $$
  select case p_game_type
    when 'individual' then p_scoring_type in ('stroke', 'new_peoria', 'match', 'stableford')
    when 'foursome' then p_scoring_type in ('stroke', 'match')
    when 'fourball' then p_scoring_type in ('stroke', 'match', 'stableford')
    when 'scramble' then p_scoring_type in ('stroke', 'match')
    when 'team_match' then p_scoring_type in ('stroke', 'new_peoria', 'match')
    else false
  end;
$$;

create or replace function public.admin_save_round_pairings(
  p_round_id uuid,
  p_game_type text,
  p_scoring_type text,
  p_assignments jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin public.members;
  v_round public.rounds;
  v_total integer;
  v_item jsonb;
  v_member_id uuid;
  v_group_no integer;
  v_position integer;
  v_group public.round_groups;
  v_invalid_group_count integer;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select *
  into v_admin
  from public.members
  where user_id = auth.uid()
    and role = 'admin'
    and status = 'active'
  limit 1;

  if not found then
    raise exception 'ADMIN_REQUIRED';
  end if;

  select *
  into v_round
  from public.rounds
  where id = p_round_id
    and club_id = v_admin.club_id
  limit 1
  for update;

  if not found then
    raise exception 'ROUND_NOT_FOUND';
  end if;

  if not public.is_valid_round_game_combination(p_game_type, p_scoring_type) then
    raise exception 'INVALID_GAME_COMBINATION';
  end if;

  if jsonb_typeof(p_assignments) <> 'array' then
    raise exception 'INVALID_ASSIGNMENTS';
  end if;

  select count(*)
  into v_total
  from jsonb_array_elements(p_assignments);

  if v_total < 3 then
    raise exception 'NOT_ENOUGH_PARTICIPANTS';
  end if;

  create temporary table tmp_round_pairings (
    member_id uuid primary key,
    group_no integer not null,
    position integer not null
  ) on commit drop;

  for v_item in select * from jsonb_array_elements(p_assignments)
  loop
    v_member_id := (v_item ->> 'member_id')::uuid;
    v_group_no := (v_item ->> 'group_no')::integer;
    v_position := coalesce((v_item ->> 'position')::integer, 1);

    if v_group_no < 1 then
      raise exception 'INVALID_GROUP_NO';
    end if;

    insert into tmp_round_pairings (member_id, group_no, position)
    values (v_member_id, v_group_no, v_position);
  end loop;

  if (select count(*) from tmp_round_pairings) <> v_total then
    raise exception 'DUPLICATE_PARTICIPANT';
  end if;

  if exists (
    select 1
    from tmp_round_pairings tp
    where not exists (
      select 1
      from public.round_participants rp
      join public.members m on m.id = rp.member_id
      where rp.round_id = p_round_id
        and rp.member_id = tp.member_id
        and m.club_id = v_admin.club_id
        and m.status = 'active'
    )
  ) then
    raise exception 'INVALID_PARTICIPANT';
  end if;

  select count(*)
  into v_invalid_group_count
  from (
    select group_no, count(*) as player_count
    from tmp_round_pairings
    group by group_no
    having count(*) < 3 or count(*) > 4
  ) invalid_groups;

  if v_invalid_group_count > 0 then
    raise exception 'INVALID_GROUP_SIZE';
  end if;

  delete from public.round_groups
  where round_id = p_round_id;

  for v_group_no in
    select distinct group_no
    from tmp_round_pairings
    order by group_no
  loop
    insert into public.round_groups (
      round_id,
      group_no,
      game_type,
      scoring_type
    )
    values (
      p_round_id,
      v_group_no,
      p_game_type,
      p_scoring_type
    )
    returning * into v_group;

    insert into public.round_group_members (
      round_group_id,
      round_id,
      member_id,
      position
    )
    select
      v_group.id,
      p_round_id,
      tp.member_id,
      tp.position
    from tmp_round_pairings tp
    where tp.group_no = v_group_no
    order by tp.position, tp.member_id;
  end loop;

  update public.rounds
  set
    game_type = p_game_type,
    scoring_type = p_scoring_type,
    pairings_updated_at = now(),
    updated_at = now()
  where id = p_round_id;

  if to_regclass('public.admin_action_logs') is not null then
    perform public.admin_log_action(
      v_admin.club_id,
      v_admin.id,
      null,
      'round.pairings.update',
      jsonb_build_object(
        'round_id', p_round_id,
        'game_type', p_game_type,
        'scoring_type', p_scoring_type,
        'participant_count', v_total
      )
    );
  end if;
end;
$$;

revoke all on function public.is_valid_round_game_combination(text, text) from public;
revoke all on function public.admin_save_round_pairings(uuid, text, text, jsonb) from public;

grant execute on function public.is_valid_round_game_combination(text, text) to authenticated;
grant execute on function public.admin_save_round_pairings(uuid, text, text, jsonb) to authenticated;

```


---

## `supabase/migrations/0014_round_scores.sql`

```sql
-- =========================================================
-- ParkBuddy round scores base migration
-- File: supabase/migrations/0014_round_scores.sql
--
-- Purpose:
--   Add score input storage for round participants.
--
-- Security goals:
--   1. Only active admins can enter scores for their own club rounds.
--   2. Scores can only be entered for members already selected as participants.
--   3. Client-provided club_id is never trusted.
--   4. Score updates are logged without storing unnecessary sensitive data.
-- =========================================================

create table if not exists public.round_scores (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references public.rounds(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete cascade,
  strokes integer,
  stableford_points integer,
  memo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (round_id, member_id)
);

create index if not exists round_scores_round_member_idx
on public.round_scores (round_id, member_id);

alter table public.round_scores enable row level security;

drop policy if exists "club members can read same club round scores"
on public.round_scores;

create policy "club members can read same club round scores"
on public.round_scores
for select
to authenticated
using (
  exists (
    select 1
    from public.rounds r
    join public.members viewer
      on viewer.club_id = r.club_id
    where r.id = round_scores.round_id
      and viewer.user_id = auth.uid()
      and viewer.status = 'active'
  )
);

create or replace function public.admin_upsert_round_scores(
  p_round_id uuid,
  p_scores jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin public.members;
  v_round public.rounds;
  v_score jsonb;
  v_member_id uuid;
  v_strokes integer;
  v_points integer;
  v_memo text;
  v_saved_count integer := 0;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select *
  into v_admin
  from public.members
  where user_id = auth.uid()
    and role = 'admin'
    and status = 'active'
  limit 1;

  if not found then
    raise exception 'ADMIN_REQUIRED';
  end if;

  select *
  into v_round
  from public.rounds
  where id = p_round_id
    and club_id = v_admin.club_id
  limit 1;

  if not found then
    raise exception 'ROUND_NOT_FOUND';
  end if;

  if jsonb_typeof(coalesce(p_scores, '[]'::jsonb)) <> 'array' then
    raise exception 'INVALID_SCORES';
  end if;

  for v_score in select * from jsonb_array_elements(p_scores)
  loop
    v_member_id := nullif(v_score ->> 'memberId', '')::uuid;
    v_strokes := nullif(v_score ->> 'strokes', '')::integer;
    v_points := nullif(v_score ->> 'stablefordPoints', '')::integer;
    v_memo := nullif(trim(coalesce(v_score ->> 'memo', '')), '');

    if v_member_id is null then
      raise exception 'INVALID_MEMBER';
    end if;

    if v_strokes is not null and (v_strokes < 1 or v_strokes > 200) then
      raise exception 'INVALID_STROKES';
    end if;

    if v_points is not null and (v_points < -20 or v_points > 100) then
      raise exception 'INVALID_STABLEFORD_POINTS';
    end if;

    if not exists (
      select 1
      from public.round_participants rp
      join public.members m
        on m.id = rp.member_id
      where rp.round_id = v_round.id
        and rp.member_id = v_member_id
        and m.club_id = v_admin.club_id
        and m.status = 'active'
    ) then
      raise exception 'MEMBER_NOT_IN_ROUND';
    end if;

    insert into public.round_scores (
      round_id,
      member_id,
      strokes,
      stableford_points,
      memo
    )
    values (
      v_round.id,
      v_member_id,
      v_strokes,
      v_points,
      v_memo
    )
    on conflict (round_id, member_id)
    do update set
      strokes = excluded.strokes,
      stableford_points = excluded.stableford_points,
      memo = excluded.memo,
      updated_at = now();

    v_saved_count := v_saved_count + 1;
  end loop;

  if to_regclass('public.admin_action_logs') is not null then
    perform public.admin_log_action(
      v_admin.club_id,
      v_admin.id,
      null,
      'round.scores.update',
      jsonb_build_object(
        'round_id', v_round.id,
        'title', v_round.title,
        'saved_count', v_saved_count
      )
    );
  end if;
end;
$$;

revoke all on function public.admin_upsert_round_scores(uuid, jsonb) from public;
grant execute on function public.admin_upsert_round_scores(uuid, jsonb) to authenticated;

```


---

## `supabase/migrations/0015_admin_update_round_status.sql`

```sql
-- =========================================================
-- ParkBuddy round status migration
-- File: supabase/migrations/0015_admin_update_round_status.sql
--
-- Purpose:
--   Allow club admins to update a round status safely.
-- =========================================================

create or replace function public.admin_update_round_status(
  p_round_id uuid,
  p_status text
)
returns public.rounds
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin public.members;
  v_round public.rounds;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select *
  into v_admin
  from public.members
  where user_id = auth.uid()
    and role = 'admin'
    and status = 'active'
  limit 1;

  if not found then
    raise exception 'ADMIN_REQUIRED';
  end if;

  if p_status not in ('scheduled', 'completed', 'cancelled') then
    raise exception 'INVALID_ROUND_STATUS';
  end if;

  select *
  into v_round
  from public.rounds
  where id = p_round_id
    and club_id = v_admin.club_id
  limit 1
  for update;

  if not found then
    raise exception 'ROUND_NOT_FOUND';
  end if;

  update public.rounds
  set
    status = p_status,
    updated_at = now()
  where id = v_round.id
  returning * into v_round;

  if to_regclass('public.admin_action_logs') is not null then
    perform public.admin_log_action(
      v_admin.club_id,
      v_admin.id,
      null,
      'round.status.update',
      jsonb_build_object(
        'round_id', v_round.id,
        'title', v_round.title,
        'status', v_round.status
      )
    );
  end if;

  return v_round;
end;
$$;

revoke all on function public.admin_update_round_status(uuid, text) from public;
grant execute on function public.admin_update_round_status(uuid, text) to authenticated;

```


---

## `supabase/migrations/0016_admin_duplicate_round.sql`

```sql
-- ParkBuddy: fix admin_duplicate_round to use members.user_id
-- Run this file in Supabase SQL Editor.

create or replace function public.admin_duplicate_round(p_round_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin record;
  v_source record;
  v_new_round_id uuid;
begin
  select m.id, m.club_id, m.role, m.status
    into v_admin
  from public.members m
  where m.user_id = auth.uid()
    and m.status = 'active'
    and m.role in ('admin', 'owner')
  limit 1;

  if v_admin.id is null then
    raise exception 'Only active admins can duplicate rounds.';
  end if;

  select r.*
    into v_source
  from public.rounds r
  where r.id = p_round_id
    and r.club_id = v_admin.club_id
  limit 1;

  if v_source.id is null then
    raise exception 'Round was not found.';
  end if;

  insert into public.rounds (
    club_id,
    title,
    course_name,
    play_date,
    status,
    game_type,
    scoring_type,
    memo
  )
  values (
    v_source.club_id,
    coalesce(v_source.title, '라운드') || ' 복사본',
    v_source.course_name,
    v_source.play_date,
    'scheduled',
    v_source.game_type,
    v_source.scoring_type,
    v_source.memo
  )
  returning id into v_new_round_id;
return v_new_round_id;
end;
$$;

grant execute on function public.admin_duplicate_round(uuid) to authenticated;

```


---

## `supabase/migrations/0017_fix_admin_duplicate_round_with_log.sql`

```sql
-- ParkBuddy 라운드 복제 기능 안정화
-- 작성일: 2026-06-13
-- 목적: 실제 Supabase 스키마 기준으로 admin_duplicate_round RPC를 재정의하고 관리자 작업 로그를 다시 기록한다.

create or replace function public.admin_duplicate_round(p_round_id uuid)
returns uuid
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_admin public.members;
  v_source public.rounds;
  v_new_round public.rounds;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select *
  into v_admin
  from public.members
  where user_id = auth.uid()
    and role = 'admin'
    and status = 'active'
  limit 1;

  if not found then
    raise exception 'ADMIN_REQUIRED';
  end if;

  select *
  into v_source
  from public.rounds
  where id = p_round_id
    and club_id = v_admin.club_id
  limit 1;

  if not found then
    raise exception 'ROUND_NOT_FOUND';
  end if;

  insert into public.rounds (
    club_id,
    event_id,
    title,
    played_on,
    course_name,
    holes,
    memo,
    created_by,
    play_date,
    start_time,
    status,
    created_by_member_id,
    game_type,
    scoring_type
  )
  values (
    v_source.club_id,
    v_source.event_id,
    coalesce(nullif(trim(v_source.title), ''), '라운드') || ' 복사본',
    coalesce(v_source.played_on, current_date),
    v_source.course_name,
    coalesce(v_source.holes, 18),
    v_source.memo,
    v_source.created_by,
    v_source.play_date,
    v_source.start_time,
    'scheduled',
    v_admin.id,
    v_source.game_type,
    v_source.scoring_type
  )
  returning * into v_new_round;

  perform public.admin_log_action(
    v_admin.club_id,
    v_admin.id,
    null,
    'round.duplicate',
    jsonb_build_object(
      'source_round_id', v_source.id,
      'new_round_id', v_new_round.id,
      'title', v_new_round.title,
      'course_name', v_new_round.course_name,
      'play_date', v_new_round.play_date,
      'status', v_new_round.status,
      'game_type', v_new_round.game_type,
      'scoring_type', v_new_round.scoring_type
    )
  );

  return v_new_round.id;
end;
$function$;

grant execute on function public.admin_duplicate_round(uuid) to authenticated;

```


---

## `supabase/migrations/0018_fix_round_duplicate_current_datetime.sql`

```sql
-- ParkBuddy 라운드 복제 기능 안정화
-- 작성일: 2026-06-13
-- 목적: 실제 Supabase 스키마 기준으로 admin_duplicate_round RPC를 재정의하고 관리자 작업 로그를 다시 기록한다.

create or replace function public.admin_duplicate_round(p_round_id uuid)
returns uuid
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_admin public.members;
  v_source public.rounds;
  v_new_round public.rounds;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select *
  into v_admin
  from public.members
  where user_id = auth.uid()
    and role = 'admin'
    and status = 'active'
  limit 1;

  if not found then
    raise exception 'ADMIN_REQUIRED';
  end if;

  select *
  into v_source
  from public.rounds
  where id = p_round_id
    and club_id = v_admin.club_id
  limit 1;

  if not found then
    raise exception 'ROUND_NOT_FOUND';
  end if;

  insert into public.rounds (
    club_id,
    event_id,
    title,
    played_on,
    course_name,
    holes,
    memo,
    created_by,
    play_date,
    start_time,
    status,
    created_by_member_id,
    game_type,
    scoring_type
  )
  values (
    v_source.club_id,
    v_source.event_id,
    coalesce(nullif(trim(v_source.title), ''), '라운드') || ' 복사본',
    coalesce(v_source.played_on, current_date),
    v_source.course_name,
    coalesce(v_source.holes, 18),
    v_source.memo,
    v_source.created_by,
    v_source.play_date,
    v_source.start_time,
    'scheduled',
    v_admin.id,
    v_source.game_type,
    v_source.scoring_type
  )
  returning * into v_new_round;

  perform public.admin_log_action(
    v_admin.club_id,
    v_admin.id,
    null,
    'round.duplicate',
    jsonb_build_object(
      'source_round_id', v_source.id,
      'new_round_id', v_new_round.id,
      'title', v_new_round.title,
      'course_name', v_new_round.course_name,
      'play_date', v_new_round.play_date,
      'status', v_new_round.status,
      'game_type', v_new_round.game_type,
      'scoring_type', v_new_round.scoring_type
    )
  );

  return v_new_round.id;
end;
$function$;

grant execute on function public.admin_duplicate_round(uuid) to authenticated;

```


---

## `supabase/migrations/0019_fix_round_duplicate_current_datetime_rpc.sql`

```sql

-- ParkBuddy 라운드 복제 날짜/시간 현재값 보정
-- 작성일: 2026-06-13
-- 목적:
-- - 라운드 복제 시 경기 형태와 점수 계산 방식은 기존 라운드 기준 유지
-- - 라운드 복제 시 날짜와 시작시간은 복제 실행 시점(Asia/Seoul) 기준으로 생성
-- - 참가자, 조 편성, 스코어는 복사하지 않음

create or replace function public.admin_duplicate_round(p_round_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor_member public.members%rowtype;
  v_source_round public.rounds%rowtype;
  v_new_round_id uuid;
  v_now_kst timestamp;
begin
  select *
    into v_actor_member
    from public.members
   where user_id = auth.uid()
   limit 1;

  if v_actor_member.id is null then
    raise exception '운영자 회원 정보를 찾을 수 없습니다.';
  end if;

  if coalesce(v_actor_member.role, '') <> 'admin' then
    raise exception '운영자만 라운드를 복제할 수 있습니다.';
  end if;

  select *
    into v_source_round
    from public.rounds
   where id = p_round_id
     and club_id = v_actor_member.club_id
   limit 1;

  if v_source_round.id is null then
    raise exception '복제할 라운드를 찾을 수 없습니다.';
  end if;

  v_now_kst := now() at time zone 'Asia/Seoul';

  insert into public.rounds (
    club_id,
    title,
    course_name,
    play_date,
    start_time,
    memo,
    status,
    game_type,
    scoring_type
  )
  values (
    v_source_round.club_id,
    coalesce(v_source_round.title, '라운드') || ' 복사본',
    v_source_round.course_name,
    v_now_kst::date,
    v_now_kst::time(0),
    v_source_round.memo,
    'scheduled',
    v_source_round.game_type,
    v_source_round.scoring_type
  )
  returning id into v_new_round_id;

  perform public.admin_log_action(
    v_actor_member.club_id,
    v_actor_member.id,
    null,
    'round.duplicate',
    jsonb_build_object(
      'source_round_id', v_source_round.id,
      'new_round_id', v_new_round_id,
      'title', coalesce(v_source_round.title, '라운드'),
      'play_date', v_now_kst::date,
      'start_time', to_char(v_now_kst, 'HH24:MI')
    )
  );

  return v_new_round_id;
end;
$$;

grant execute on function public.admin_duplicate_round(uuid) to authenticated;

```


---

## `supabase/migrations/0020_fix_round_pairing_scoring_type_save.sql`

```sql

-- ParkBuddy: 조 편성 저장 후 라운드 경기 형태/점수 계산 방식 동기화
-- 작성일: 2026-06-13
-- 목적: admin_save_round_pairings 저장 성공 후 rounds.scoring_type이 비어 목록에서 "미지정"으로 보이는 문제 보정

create or replace function public.admin_save_round_game_settings(
  p_round_id uuid,
  p_game_type text,
  p_scoring_type text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_round record;
  v_actor record;
  v_valid boolean := false;
begin
  select id, club_id
    into v_round
    from public.rounds
   where id = p_round_id;

  if v_round.id is null then
    raise exception 'ROUND_NOT_FOUND';
  end if;

  select id, club_id, role
    into v_actor
    from public.members
   where user_id = auth.uid()
     and club_id = v_round.club_id
   limit 1;

  if v_actor.id is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  if coalesce(v_actor.role::text, '') not in ('owner', 'admin', 'manager', '운영자', '운영진') then
    raise exception 'ADMIN_REQUIRED';
  end if;

  v_valid :=
    (p_game_type = 'individual' and p_scoring_type in ('stroke', 'new_peoria', 'match', 'stableford'))
    or (p_game_type = 'foursome' and p_scoring_type in ('stroke', 'match'))
    or (p_game_type = 'fourball' and p_scoring_type in ('stroke', 'match', 'stableford'))
    or (p_game_type = 'scramble' and p_scoring_type in ('stroke', 'match'))
    or (p_game_type = 'team_match' and p_scoring_type in ('stroke', 'new_peoria', 'match'));

  if not v_valid then
    raise exception 'INVALID_GAME_COMBINATION';
  end if;

  if exists (
    select 1
      from information_schema.columns
     where table_schema = 'public'
       and table_name = 'rounds'
       and column_name = 'updated_at'
  ) then
    update public.rounds
       set game_type = p_game_type,
           scoring_type = p_scoring_type,
           updated_at = now()
     where id = p_round_id
       and club_id = v_round.club_id;
  else
    update public.rounds
       set game_type = p_game_type,
           scoring_type = p_scoring_type
     where id = p_round_id
       and club_id = v_round.club_id;
  end if;
end;
$$;

grant execute on function public.admin_save_round_game_settings(uuid, text, text) to authenticated;

```


---

## `supabase/migrations/0021_board_private_security.sql`

```sql
-- ParkBuddy board private posts and security hardening
-- Apply this in Supabase SQL Editor before checking the board UI.

alter table public.posts
  add column if not exists is_private boolean not null default false;

create index if not exists posts_club_private_created_idx
  on public.posts(club_id, is_private, is_pinned desc, created_at desc);

-- Keep post privacy changes explicit and safe.
create or replace function public.prevent_post_privilege_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return new;
  end if;

  if not public.is_club_admin(old.club_id) then
    if new.club_id is distinct from old.club_id
       or new.author_id is distinct from old.author_id
       or new.post_type is distinct from old.post_type
       or new.is_pinned is distinct from old.is_pinned then
      raise exception 'not allowed to update protected post fields';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_post_privilege_escalation on public.posts;
create trigger prevent_post_privilege_escalation
before update on public.posts
for each row
execute function public.prevent_post_privilege_escalation();

-- Posts: private posts are readable only by the author or club admins.
-- Drop both legacy and current policy names so this file can be safely re-run in Supabase SQL Editor.
drop policy if exists "members can read club posts" on public.posts;
drop policy if exists "members can read allowed club posts" on public.posts;
drop policy if exists "members can create free posts and admins can create notices" on public.posts;
drop policy if exists "authors or admins can update posts" on public.posts;
drop policy if exists "authors or admins can delete posts" on public.posts;

create policy "members can read allowed club posts" on public.posts
for select to authenticated
using (
  club_id = public.current_club_id()
  and (
    is_private = false
    or author_id = public.current_member_id()
    or public.is_club_admin(club_id)
  )
);

create policy "members can create free posts and admins can create notices" on public.posts
for insert to authenticated
with check (
  club_id = public.current_club_id()
  and author_id = public.current_member_id()
  and ((post_type = 'free' and is_pinned = false) or public.is_club_admin(club_id))
);

create policy "authors or admins can update posts" on public.posts
for update to authenticated
using (
  author_id = public.current_member_id() or public.is_club_admin(club_id)
)
with check (
  public.is_club_admin(club_id)
  or (
    author_id = public.current_member_id()
    and club_id = public.current_club_id()
    and post_type = 'free'
    and is_pinned = false
  )
);

create policy "authors or admins can delete posts" on public.posts
for delete to authenticated
using (
  author_id = public.current_member_id() or public.is_club_admin(club_id)
);

-- Attachments inherit post visibility. This prevents private post files from being discoverable by other members.
drop policy if exists "members can read club attachments" on public.post_attachments;
drop policy if exists "members can read allowed post attachments" on public.post_attachments;

create policy "members can read allowed post attachments" on public.post_attachments
for select to authenticated
using (
  exists (
    select 1
    from public.posts p
    where p.id = post_attachments.post_id
      and p.club_id = public.current_club_id()
      and (
        p.is_private = false
        or p.author_id = public.current_member_id()
        or public.is_club_admin(p.club_id)
      )
  )
);

-- Storage object policies mirror post visibility and ownership.
drop policy if exists "club members can read post images" on storage.objects;
drop policy if exists "members can read allowed post images" on storage.objects;
drop policy if exists "club members can upload post images" on storage.objects;
drop policy if exists "authors or admins can upload post images" on storage.objects;

create policy "members can read allowed post images" on storage.objects
for select to authenticated
using (
  bucket_id = 'post-images'
  and (storage.foldername(name))[1] ~* '^[0-9a-f-]{36}$'
  and (storage.foldername(name))[2] ~* '^[0-9a-f-]{36}$'
  and exists (
    select 1
    from public.posts p
    where p.club_id = public.current_club_id()
      and p.club_id::text = (storage.foldername(name))[1]
      and p.id = ((storage.foldername(name))[2])::uuid
      and (
        p.is_private = false
        or p.author_id = public.current_member_id()
        or public.is_club_admin(p.club_id)
      )
  )
);

create policy "authors or admins can upload post images" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'post-images'
  and (storage.foldername(name))[1] ~* '^[0-9a-f-]{36}$'
  and (storage.foldername(name))[2] ~* '^[0-9a-f-]{36}$'
  and exists (
    select 1
    from public.posts p
    where p.club_id = public.current_club_id()
      and p.club_id::text = (storage.foldername(name))[1]
      and p.id = ((storage.foldername(name))[2])::uuid
      and (p.author_id = public.current_member_id() or public.is_club_admin(p.club_id))
  )
);

```


---

## `supabase/migrations/0022_event_to_round_link.sql`

```sql
-- =========================================================
-- ParkBuddy event to round link flow
-- File: supabase/parkbuddy_event_to_round_link.sql
--
-- Purpose:
--   Let club admins create one linked round from an event's attend votes.
--   The created round is linked through rounds.event_id and attendees are
--   inserted into round_participants automatically.
--
-- Apply:
--   Run this file in Supabase SQL Editor, then run npm run verify locally.
-- =========================================================

alter table public.events
  add column if not exists holes integer not null default 18;

alter table public.rounds
  add column if not exists event_id uuid references public.events(id) on delete set null,
  add column if not exists played_on date,
  add column if not exists holes integer not null default 18,
  add column if not exists created_by uuid references public.members(id) on delete set null,
  add column if not exists game_type text,
  add column if not exists scoring_type text;

create index if not exists rounds_event_id_idx
on public.rounds (event_id);

create index if not exists event_votes_event_status_member_idx
on public.event_votes (event_id, status, member_id);

create or replace function public.admin_create_round_from_event(p_event_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin public.members;
  v_event public.events;
  v_existing_round_id uuid;
  v_round public.rounds;
  v_attendee_count integer;
  v_play_date date;
  v_start_time time;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  if p_event_id is null then
    raise exception 'INVALID_EVENT';
  end if;

  select *
  into v_admin
  from public.members
  where user_id = auth.uid()
    and role = 'admin'
    and status = 'active'
  limit 1;

  if not found then
    raise exception 'ADMIN_REQUIRED';
  end if;

  -- Prevent duplicate rounds when two admins click the button at nearly the same time.
  perform pg_advisory_xact_lock(hashtextextended(p_event_id::text, 0));

  select *
  into v_event
  from public.events
  where id = p_event_id
    and club_id = v_admin.club_id
  limit 1
  for update;

  if not found then
    raise exception 'EVENT_NOT_FOUND';
  end if;

  select id
  into v_existing_round_id
  from public.rounds
  where event_id = v_event.id
    and club_id = v_admin.club_id
  order by created_at desc
  limit 1;

  if v_existing_round_id is not null then
    return v_existing_round_id;
  end if;

  select count(*)
  into v_attendee_count
  from public.event_votes ev
  join public.members m
    on m.id = ev.member_id
  where ev.event_id = v_event.id
    and ev.status = 'attend'
    and m.club_id = v_admin.club_id
    and m.status = 'active';

  if coalesce(v_attendee_count, 0) <= 0 then
    raise exception 'NO_ATTENDEES';
  end if;

  v_play_date := (v_event.starts_at at time zone 'Asia/Seoul')::date;
  v_start_time := (v_event.starts_at at time zone 'Asia/Seoul')::time;

  insert into public.rounds (
    club_id,
    event_id,
    title,
    played_on,
    course_name,
    holes,
    memo,
    created_by,
    play_date,
    start_time,
    status,
    created_by_member_id,
    game_type,
    scoring_type
  )
  values (
    v_admin.club_id,
    v_event.id,
    coalesce(nullif(trim(v_event.title), ''), '라운딩'),
    v_play_date,
    coalesce(nullif(trim(v_event.course_name), ''), '미정'),
    coalesce(v_event.holes, 18),
    v_event.memo,
    v_admin.id,
    v_play_date,
    v_start_time,
    'scheduled',
    v_admin.id,
    case v_event.event_type
      when 'tournament' then 'tournament'
      when 'casual' then 'casual'
      else 'regular'
    end,
    'stableford'
  )
  returning * into v_round;

  insert into public.round_participants (
    club_id,
    round_id,
    member_id,
    status
  )
  select
    v_admin.club_id,
    v_round.id,
    ev.member_id,
    'confirmed'
  from public.event_votes ev
  join public.members m
    on m.id = ev.member_id
  where ev.event_id = v_event.id
    and ev.status = 'attend'
    and m.club_id = v_admin.club_id
    and m.status = 'active'
  on conflict (round_id, member_id)
  do update set
    status = 'confirmed',
    updated_at = now();

  if to_regprocedure('public.admin_log_action(uuid,uuid,uuid,text,jsonb)') is not null then
    perform public.admin_log_action(
      v_admin.club_id,
      v_admin.id,
      null,
      'round.create_from_event',
      jsonb_build_object(
        'event_id', v_event.id,
        'round_id', v_round.id,
        'title', v_round.title,
        'attendee_count', v_attendee_count
      )
    );
  end if;

  return v_round.id;
end;
$$;

revoke all on function public.admin_create_round_from_event(uuid) from public;
grant execute on function public.admin_create_round_from_event(uuid) to authenticated;

```


---

## `supabase/parkbuddy_add_round_soft_delete_schema.sql`

```sql
-- ParkBuddy round soft-delete schema migration
-- Safe scope: database schema/RPC only. No app code changes.

begin;

-- 1) Add soft-delete columns to rounds.
alter table public.rounds
  add column if not exists deleted_at timestamptz null,
  add column if not exists deleted_by_member_id uuid null references public.members(id) on delete set null;

-- 2) Helpful indexes for normal list and deleted list views.
create index if not exists idx_rounds_club_deleted_at
  on public.rounds (club_id, deleted_at);

create index if not exists idx_rounds_deleted_at
  on public.rounds (deleted_at);

-- 3) Soft delete RPC.
create or replace function public.admin_soft_delete_round(p_round_id uuid)
returns public.rounds
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor public.members%rowtype;
  v_round public.rounds%rowtype;
begin
  select *
    into v_actor
    from public.members
   where user_id = auth.uid()
     and status = 'active'
   limit 1;

  if v_actor.id is null then
    raise exception 'ACTIVE_MEMBER_NOT_FOUND';
  end if;

  select *
    into v_round
    from public.rounds
   where id = p_round_id
   for update;

  if v_round.id is null then
    raise exception 'ROUND_NOT_FOUND';
  end if;

  if v_round.club_id <> v_actor.club_id then
    raise exception 'ROUND_CLUB_MISMATCH';
  end if;

  if not public.is_club_admin(v_round.club_id) then
    raise exception 'ADMIN_REQUIRED';
  end if;

  update public.rounds
     set deleted_at = coalesce(deleted_at, now()),
         deleted_by_member_id = coalesce(deleted_by_member_id, v_actor.id),
         updated_at = now()
   where id = p_round_id
   returning * into v_round;

  perform public.admin_log_action(
    v_round.club_id,
    v_actor.id,
    null,
    'round_soft_delete',
    jsonb_build_object(
      'round_id', v_round.id,
      'round_title', v_round.title,
      'deleted_at', v_round.deleted_at
    )
  );

  return v_round;
end;
$$;

-- 4) Restore RPC.
create or replace function public.admin_restore_round(p_round_id uuid)
returns public.rounds
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor public.members%rowtype;
  v_round public.rounds%rowtype;
begin
  select *
    into v_actor
    from public.members
   where user_id = auth.uid()
     and status = 'active'
   limit 1;

  if v_actor.id is null then
    raise exception 'ACTIVE_MEMBER_NOT_FOUND';
  end if;

  select *
    into v_round
    from public.rounds
   where id = p_round_id
   for update;

  if v_round.id is null then
    raise exception 'ROUND_NOT_FOUND';
  end if;

  if v_round.club_id <> v_actor.club_id then
    raise exception 'ROUND_CLUB_MISMATCH';
  end if;

  if not public.is_club_admin(v_round.club_id) then
    raise exception 'ADMIN_REQUIRED';
  end if;

  update public.rounds
     set deleted_at = null,
         deleted_by_member_id = null,
         updated_at = now()
   where id = p_round_id
   returning * into v_round;

  perform public.admin_log_action(
    v_round.club_id,
    v_actor.id,
    null,
    'round_restore',
    jsonb_build_object(
      'round_id', v_round.id,
      'round_title', v_round.title
    )
  );

  return v_round;
end;
$$;

-- 5) Permissions for authenticated users; function body still checks active admin.
grant execute on function public.admin_soft_delete_round(uuid) to authenticated;
grant execute on function public.admin_restore_round(uuid) to authenticated;

commit;

-- Verification queries after running the migration:
-- select column_name, data_type, is_nullable
-- from information_schema.columns
-- where table_schema = 'public'
--   and table_name = 'rounds'
--   and column_name in ('deleted_at', 'deleted_by_member_id')
-- order by column_name;
--
-- select proname, pg_get_function_arguments(oid) as arguments, pg_get_function_result(oid) as result_type
-- from pg_proc
-- where pronamespace = 'public'::regnamespace
--   and proname in ('admin_soft_delete_round', 'admin_restore_round')
-- order by proname;

```


---

## `supabase/parkbuddy_board_private_security.sql`

```sql
-- ParkBuddy board private posts and security hardening
-- Apply this in Supabase SQL Editor before checking the board UI.

alter table public.posts
  add column if not exists is_private boolean not null default false;

create index if not exists posts_club_private_created_idx
  on public.posts(club_id, is_private, is_pinned desc, created_at desc);

-- Keep post privacy changes explicit and safe.
create or replace function public.prevent_post_privilege_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return new;
  end if;

  if not public.is_club_admin(old.club_id) then
    if new.club_id is distinct from old.club_id
       or new.author_id is distinct from old.author_id
       or new.post_type is distinct from old.post_type
       or new.is_pinned is distinct from old.is_pinned then
      raise exception 'not allowed to update protected post fields';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_post_privilege_escalation on public.posts;
create trigger prevent_post_privilege_escalation
before update on public.posts
for each row
execute function public.prevent_post_privilege_escalation();

-- Posts: private posts are readable only by the author or club admins.
-- Drop both legacy and current policy names so this file can be safely re-run in Supabase SQL Editor.
drop policy if exists "members can read club posts" on public.posts;
drop policy if exists "members can read allowed club posts" on public.posts;
drop policy if exists "members can create free posts and admins can create notices" on public.posts;
drop policy if exists "authors or admins can update posts" on public.posts;
drop policy if exists "authors or admins can delete posts" on public.posts;

create policy "members can read allowed club posts" on public.posts
for select to authenticated
using (
  club_id = public.current_club_id()
  and (
    is_private = false
    or author_id = public.current_member_id()
    or public.is_club_admin(club_id)
  )
);

create policy "members can create free posts and admins can create notices" on public.posts
for insert to authenticated
with check (
  club_id = public.current_club_id()
  and author_id = public.current_member_id()
  and ((post_type = 'free' and is_pinned = false) or public.is_club_admin(club_id))
);

create policy "authors or admins can update posts" on public.posts
for update to authenticated
using (
  author_id = public.current_member_id() or public.is_club_admin(club_id)
)
with check (
  public.is_club_admin(club_id)
  or (
    author_id = public.current_member_id()
    and club_id = public.current_club_id()
    and post_type = 'free'
    and is_pinned = false
  )
);

create policy "authors or admins can delete posts" on public.posts
for delete to authenticated
using (
  author_id = public.current_member_id() or public.is_club_admin(club_id)
);

-- Attachments inherit post visibility. This prevents private post files from being discoverable by other members.
drop policy if exists "members can read club attachments" on public.post_attachments;
drop policy if exists "members can read allowed post attachments" on public.post_attachments;

create policy "members can read allowed post attachments" on public.post_attachments
for select to authenticated
using (
  exists (
    select 1
    from public.posts p
    where p.id = post_attachments.post_id
      and p.club_id = public.current_club_id()
      and (
        p.is_private = false
        or p.author_id = public.current_member_id()
        or public.is_club_admin(p.club_id)
      )
  )
);

-- Storage object policies mirror post visibility and ownership.
drop policy if exists "club members can read post images" on storage.objects;
drop policy if exists "members can read allowed post images" on storage.objects;
drop policy if exists "club members can upload post images" on storage.objects;
drop policy if exists "authors or admins can upload post images" on storage.objects;

create policy "members can read allowed post images" on storage.objects
for select to authenticated
using (
  bucket_id = 'post-images'
  and (storage.foldername(name))[1] ~* '^[0-9a-f-]{36}$'
  and (storage.foldername(name))[2] ~* '^[0-9a-f-]{36}$'
  and exists (
    select 1
    from public.posts p
    where p.club_id = public.current_club_id()
      and p.club_id::text = (storage.foldername(name))[1]
      and p.id = ((storage.foldername(name))[2])::uuid
      and (
        p.is_private = false
        or p.author_id = public.current_member_id()
        or public.is_club_admin(p.club_id)
      )
  )
);

create policy "authors or admins can upload post images" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'post-images'
  and (storage.foldername(name))[1] ~* '^[0-9a-f-]{36}$'
  and (storage.foldername(name))[2] ~* '^[0-9a-f-]{36}$'
  and exists (
    select 1
    from public.posts p
    where p.club_id = public.current_club_id()
      and p.club_id::text = (storage.foldername(name))[1]
      and p.id = ((storage.foldername(name))[2])::uuid
      and (p.author_id = public.current_member_id() or public.is_club_admin(p.club_id))
  )
);

```


---

## `supabase/parkbuddy_event_to_round_link.sql`

```sql
-- =========================================================
-- ParkBuddy event to round link flow
-- File: supabase/parkbuddy_event_to_round_link.sql
--
-- Purpose:
--   Let club admins create one linked round from an event's attend votes.
--   The created round is linked through rounds.event_id and attendees are
--   inserted into round_participants automatically.
--
-- Apply:
--   Run this file in Supabase SQL Editor, then run npm run verify locally.
-- =========================================================

alter table public.events
  add column if not exists holes integer not null default 18;

alter table public.rounds
  add column if not exists event_id uuid references public.events(id) on delete set null,
  add column if not exists played_on date,
  add column if not exists holes integer not null default 18,
  add column if not exists created_by uuid references public.members(id) on delete set null,
  add column if not exists game_type text,
  add column if not exists scoring_type text;

create index if not exists rounds_event_id_idx
on public.rounds (event_id);

create index if not exists event_votes_event_status_member_idx
on public.event_votes (event_id, status, member_id);

create or replace function public.admin_create_round_from_event(p_event_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin public.members;
  v_event public.events;
  v_existing_round_id uuid;
  v_round public.rounds;
  v_attendee_count integer;
  v_play_date date;
  v_start_time time;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  if p_event_id is null then
    raise exception 'INVALID_EVENT';
  end if;

  select *
  into v_admin
  from public.members
  where user_id = auth.uid()
    and role = 'admin'
    and status = 'active'
  limit 1;

  if not found then
    raise exception 'ADMIN_REQUIRED';
  end if;

  -- Prevent duplicate rounds when two admins click the button at nearly the same time.
  perform pg_advisory_xact_lock(hashtextextended(p_event_id::text, 0));

  select *
  into v_event
  from public.events
  where id = p_event_id
    and club_id = v_admin.club_id
  limit 1
  for update;

  if not found then
    raise exception 'EVENT_NOT_FOUND';
  end if;

  select id
  into v_existing_round_id
  from public.rounds
  where event_id = v_event.id
    and club_id = v_admin.club_id
  order by created_at desc
  limit 1;

  if v_existing_round_id is not null then
    return v_existing_round_id;
  end if;

  select count(*)
  into v_attendee_count
  from public.event_votes ev
  join public.members m
    on m.id = ev.member_id
  where ev.event_id = v_event.id
    and ev.status = 'attend'
    and m.club_id = v_admin.club_id
    and m.status = 'active';

  if coalesce(v_attendee_count, 0) <= 0 then
    raise exception 'NO_ATTENDEES';
  end if;

  v_play_date := (v_event.starts_at at time zone 'Asia/Seoul')::date;
  v_start_time := (v_event.starts_at at time zone 'Asia/Seoul')::time;

  insert into public.rounds (
    club_id,
    event_id,
    title,
    played_on,
    course_name,
    holes,
    memo,
    created_by,
    play_date,
    start_time,
    status,
    created_by_member_id,
    game_type,
    scoring_type
  )
  values (
    v_admin.club_id,
    v_event.id,
    coalesce(nullif(trim(v_event.title), ''), '라운딩'),
    v_play_date,
    coalesce(nullif(trim(v_event.course_name), ''), '미정'),
    coalesce(v_event.holes, 18),
    v_event.memo,
    v_admin.id,
    v_play_date,
    v_start_time,
    'scheduled',
    v_admin.id,
    case v_event.event_type
      when 'tournament' then 'tournament'
      when 'casual' then 'casual'
      else 'regular'
    end,
    'stableford'
  )
  returning * into v_round;

  insert into public.round_participants (
    club_id,
    round_id,
    member_id,
    status
  )
  select
    v_admin.club_id,
    v_round.id,
    ev.member_id,
    'confirmed'
  from public.event_votes ev
  join public.members m
    on m.id = ev.member_id
  where ev.event_id = v_event.id
    and ev.status = 'attend'
    and m.club_id = v_admin.club_id
    and m.status = 'active'
  on conflict (round_id, member_id)
  do update set
    status = 'confirmed',
    updated_at = now();

  if to_regprocedure('public.admin_log_action(uuid,uuid,uuid,text,jsonb)') is not null then
    perform public.admin_log_action(
      v_admin.club_id,
      v_admin.id,
      null,
      'round.create_from_event',
      jsonb_build_object(
        'event_id', v_event.id,
        'round_id', v_round.id,
        'title', v_round.title,
        'attendee_count', v_attendee_count
      )
    );
  end if;

  return v_round.id;
end;
$$;

revoke all on function public.admin_create_round_from_event(uuid) from public;
grant execute on function public.admin_create_round_from_event(uuid) to authenticated;

```


---

## `supabase/parkbuddy_harden_round_safety_rpc_permissions.sql`

```sql
-- ParkBuddy round safety RPC permission hardening
-- Purpose: reduce unnecessary execution surface for round soft-delete / restore RPCs.
--
-- Safe scope:
-- - No data is changed.
-- - The RPC bodies are not replaced.
-- - Anonymous/public execution is revoked.
-- - Authenticated execution is kept because the RPC body still checks active admin membership.
--
-- Run this in Supabase SQL Editor after reviewing the check SQL result.

begin;

revoke execute on function public.admin_soft_delete_round(uuid) from public;
revoke execute on function public.admin_restore_round(uuid) from public;

revoke execute on function public.admin_soft_delete_round(uuid) from anon;
revoke execute on function public.admin_restore_round(uuid) from anon;

-- Keep authenticated access. The function body validates active member, same club, and admin role.
grant execute on function public.admin_soft_delete_round(uuid) to authenticated;
grant execute on function public.admin_restore_round(uuid) to authenticated;

comment on function public.admin_soft_delete_round(uuid)
  is 'ParkBuddy admin-only round soft delete RPC. Execute is granted to authenticated users; function body checks active same-club admin.';

comment on function public.admin_restore_round(uuid)
  is 'ParkBuddy admin-only round restore RPC. Execute is granted to authenticated users; function body checks active same-club admin.';

commit;

-- Recommended verification after commit:
-- Run supabase/parkbuddy_round_safety_rpc_permission_check.sql again.

```


---

## `supabase/parkbuddy_round_safety_rpc_permission_check.sql`

```sql
-- ParkBuddy round safety RPC permission check
-- Purpose: verify that round soft-delete / restore RPCs are not executable by anonymous users
-- and that the functions keep security-definer safeguards.
--
-- How to use:
-- 1. Open Supabase Dashboard > SQL Editor.
-- 2. Run this file.
-- 3. Confirm that the two target functions show:
--    - security_definer = true
--    - has_public_execute = false
--    - has_anon_execute = false
--    - has_authenticated_execute = true
--    - search_path contains public
--
-- This SQL is read-only. It does not change data or permissions.

with target_functions as (
  select
    p.oid,
    n.nspname as schema_name,
    p.proname as function_name,
    pg_get_function_identity_arguments(p.oid) as arguments,
    pg_get_function_result(p.oid) as result_type,
    p.prosecdef as security_definer,
    p.proconfig as config
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.proname in ('admin_soft_delete_round', 'admin_restore_round')
)
select
  schema_name,
  function_name,
  arguments,
  result_type,
  security_definer,
  config,
  has_function_privilege('public', oid, 'execute') as has_public_execute,
  has_function_privilege('anon', oid, 'execute') as has_anon_execute,
  has_function_privilege('authenticated', oid, 'execute') as has_authenticated_execute,
  case
    when not security_definer then 'FAIL: function should be SECURITY DEFINER'
    when has_function_privilege('anon', oid, 'execute') then 'FAIL: anon should not execute this RPC'
    when has_function_privilege('public', oid, 'execute') then 'WARN: PUBLIC execute should be revoked'
    when not has_function_privilege('authenticated', oid, 'execute') then 'FAIL: authenticated should execute this RPC'
    when config::text not ilike '%search_path=public%' then 'WARN: search_path should be pinned to public'
    else 'PASS'
  end as audit_result
from target_functions
order by function_name;

```


---

## `supabase/parkbuddy_round_soft_delete_schema_check.sql`

```sql
-- ParkBuddy round soft delete schema check
-- Run this in Supabase SQL Editor, then export or copy the results.

select
  'rounds_columns' as section,
  c.table_schema,
  c.table_name,
  c.column_name,
  c.data_type,
  c.is_nullable,
  c.column_default,
  c.ordinal_position::text as extra_1,
  null::text as extra_2
from information_schema.columns c
where c.table_schema = 'public'
  and c.table_name = 'rounds'

union all

select
  'round_related_tables' as section,
  c.table_schema,
  c.table_name,
  c.column_name,
  c.data_type,
  c.is_nullable,
  c.column_default,
  c.ordinal_position::text as extra_1,
  null::text as extra_2
from information_schema.columns c
where c.table_schema = 'public'
  and c.table_name in (
    'rounds',
    'round_participants',
    'round_pairings',
    'round_scores',
    'admin_action_logs'
  )

union all

select
  'functions' as section,
  n.nspname as table_schema,
  p.proname as table_name,
  pg_get_function_identity_arguments(p.oid) as column_name,
  pg_get_function_result(p.oid) as data_type,
  null::text as is_nullable,
  null::text as column_default,
  p.oid::text as extra_1,
  null::text as extra_2
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and (
    p.proname ilike '%round%'
    or p.proname ilike '%admin_log%'
  )

union all

select
  'policies' as section,
  schemaname as table_schema,
  tablename as table_name,
  policyname as column_name,
  cmd as data_type,
  permissive as is_nullable,
  roles::text as column_default,
  qual as extra_1,
  with_check as extra_2
from pg_policies
where schemaname = 'public'
  and tablename in (
    'rounds',
    'round_participants',
    'round_pairings',
    'round_scores',
    'admin_action_logs'
  )
order by section, table_name, extra_1, column_name;

```


---

## `supabase/parkbuddy_verify_round_soft_delete_schema.sql`

```sql
-- ParkBuddy round soft-delete schema verification
-- Run this in Supabase SQL Editor after applying parkbuddy_add_round_soft_delete_schema.sql.
-- This query does not modify data.

select
  'rounds_columns' as section,
  c.table_schema,
  c.table_name,
  c.column_name,
  c.data_type,
  c.is_nullable,
  c.column_default::text as detail_1,
  null::text as detail_2
from information_schema.columns c
where c.table_schema = 'public'
  and c.table_name = 'rounds'
  and c.column_name in ('deleted_at', 'deleted_by_member_id')
union all
select
  'rounds_indexes' as section,
  schemaname as table_schema,
  tablename as table_name,
  indexname as column_name,
  'index' as data_type,
  null::text as is_nullable,
  indexdef as detail_1,
  null::text as detail_2
from pg_indexes
where schemaname = 'public'
  and tablename = 'rounds'
  and (
    indexname ilike '%deleted%'
    or indexdef ilike '%deleted_at%'
  )
union all
select
  'functions' as section,
  n.nspname as table_schema,
  p.proname as table_name,
  pg_get_function_arguments(p.oid) as column_name,
  pg_get_function_result(p.oid) as data_type,
  null::text as is_nullable,
  p.oid::text as detail_1,
  null::text as detail_2
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in ('admin_soft_delete_round', 'admin_restore_round')
union all
select
  'admin_log_columns' as section,
  c.table_schema,
  c.table_name,
  c.column_name,
  c.data_type,
  c.is_nullable,
  c.column_default::text as detail_1,
  null::text as detail_2
from information_schema.columns c
where c.table_schema = 'public'
  and c.table_name = 'admin_action_logs'
  and c.column_name in ('metadata', 'action', 'actor_member_id', 'target_member_id')
order by section, table_name, column_name;

```


---

## `supabase/seed.sql`

```sql
-- Optional local seed. Replace the UUID values before use.
insert into public.clubs (id, name, invite_code)
values ('00000000-0000-0000-0000-000000000001', '파크버디 샘플 동호회', 'PARKBUDDY')
on conflict (id) do nothing;

-- After a real user signs in, copy auth.users.id and set user_id for the first admin.
insert into public.members (club_id, name, phone, handicap, role, status)
values ('00000000-0000-0000-0000-000000000001', '운영진', null, 0, 'admin', 'active');

```


---

## `tailwind.config.ts`

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          600: '#059669',
          700: '#047857',
        },
      },
    },
  },
  plugins: [],
};

export default config;

```


---

## `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": [
        "./src/*"
      ]
    },
    "noEmit": true
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}

```

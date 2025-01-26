# Product Backlog - Qrafthive

Qrafthive é um aplicativo web que permite a criação de QR Codes personalizados de maneira intuitiva e funcional. O projeto utiliza **Next.js**, **TypeScript** e **MongoDB** como principais tecnologias.

---

## Objetivo do Projeto
Oferecer uma plataforma completa para criação e personalização de QR Codes, expandindo suas utilidades para diferentes cenários, como redes sociais, eventos, chamadas telefônicas e muito mais.

---

## Backlog do Projeto

| **Status** | **Categoria**           | **Tarefa**                                                                                                                                                                       | **Descrição**                                                                                                                                         |
|------------|--------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| ❌         | **Autenticação e Perfil** | Criar sistema de cadastro/login funcional com OAuth                                                                                                                             | Implementar autenticação segura e suporte a provedores como Google e GitHub.                                                                          |
| ❌         |                          | Desenvolver dashboard para o perfil do usuário                                                                                                                                 | Visualizar QR Codes criados e gerenciar informações do perfil.                                                                                        |
| ❌         | **Interface do Usuário** | Refazer a navbar                                                                                                                                                                | Criar um design moderno e responsivo, com links para "Dashboard", "Criar QR Code", e "Configurações".                                                 |
| ❌         |                          | Conectar inputs customizados ao gerador de QR Code                                                                                                                              | Implementar personalização de QR Codes (cores, formatos, tamanhos, logotipos integrados).                                                             |
| ❌         | **Personalização e Expansão** | Encontrar ou criar um logotipo                                                                                                                                                | Desenvolver uma identidade visual profissional para o projeto.                                                                                        |
| ❌         |                          | Expandir o suporte para outros tipos de geradores de código                                                                                                                    | Integrar biblioteca [@barcode-bakery/barcode-react](https://www.npmjs.com/package/@barcode-bakery/barcode-react).                                      |
| ❌         |                          | Explorar novas formas de uso de QR Codes                                                                                                                                       | Ex.: compartilhar tweets, criar postagens no LinkedIn, chamadas telefônicas, gerar eventos. Referências: [TEC-IT](https://barcode.tec-it.com/) e [ZXing](https://zxing.org/). |
| ❌         | **Futuro Planejado**     | Melhorar acessibilidade e internacionalização (i18n)                                                                                                                            | Tornar o app acessível para usuários com diferentes necessidades e traduzido para outros idiomas.                                                      |
| ❌         |                          | Criar uma API para desenvolvedores                                                                                                                                              | Oferecer a funcionalidade do Qrafthive como serviço para outros projetos.                                                                             |

---

## Referências
- [@barcode-bakery/barcode-react](https://www.npmjs.com/package/@barcode-bakery/barcode-react)  
- [TEC-IT QR Code Generator](https://barcode.tec-it.com/en/MobileQRLinkedInShare?data=https://www.tec-it.com)  
- [ZXing Decoder](https://zxing.org/w/decode)
- [vCard](https://en.wikipedia.org/wiki/VCard)
- [Como fazer esse qrcode](https://stackoverflow.com/questions/70498657/is-it-possible-to-add-form-data-in-qr-code)


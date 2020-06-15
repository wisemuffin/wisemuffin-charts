module.exports = {
  title: "Wisemuffin Charts",
  tagline: "Data visualisation library built with D3",
  url: "https://your-docusaurus-test-site.com",
  baseUrl: "/",
  favicon: "img/favicon.ico",
  organizationName: "wisemuffin", // Usually your GitHub org/user name.
  projectName: "wisemuffin-charts", // Usually your repo name.
  themeConfig: {
    navbar: {
      title: "Wisemuffin Charts",
      logo: {
        alt: "My Site Logo",
        src: "img/logo.svg"
      },
      links: [
        {
          to: "docs/gettingStarted/gettingStarted",
          activeBasePath: "docs",
          label: "Docs",
          position: "left"
        },
        {
          href: "http://wisemuffin.com/chartlib",
          label: "Example Charts",
          position: "left"
        },
        // {to: 'blog', label: 'Blog', position: 'left'},
        {
          href: "https://github.com/wisemuffin/wisemuffin-charts",
          label: "GitHub",
          position: "right"
        }
      ]
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Getting Started",
              to: "docs/gettingStarted/gettingStarted"
            },
            {
              label: "Second Doc",
              to: "docs/gettingStarted/keyConcepts"
            }
          ]
        },
        {
          title: "Community",
          items: []
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/wisemuffin/wisemuffin-charts"
            }
          ]
        }
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Wisemuffin-Charts, Inc. Built with Docusaurus.`
    }
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl: "https://github.com/facebook/docusaurus/edit/master/website/"
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            "https://github.com/facebook/docusaurus/edit/master/website/blog/"
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css")
        }
      }
    ]
  ]
};

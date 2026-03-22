import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Campfire - Howdy, A11y",
  description: "Gather 'round and learn about web accessibility and the WCAG standards.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-text mb-8 font-display">
        Gather &rsquo;Round the Campfire
      </h1>

      <div className="prose prose-slate max-w-none space-y-6">
        <section aria-labelledby="what-heading">
          <h2 id="what-heading" className="text-xl font-semibold text-text mb-3 font-display">
            What is This Place?
          </h2>
          <p className="text-text-muted leading-relaxed">
            a11y Roundup is an interactive frontier adventure designed to teach
            developers about web accessibility through hands-on bounty hunting.
            Instead of just reading about WCAG standards from dusty textbooks,
            you wrangle real accessibility outlaws and see the impact of your
            fixes in real time.
          </p>
        </section>

        <section aria-labelledby="why-heading">
          <h2 id="why-heading" className="text-xl font-semibold text-text mb-3 font-display">
            Why Ride This Trail?
          </h2>
          <p className="text-text-muted leading-relaxed">
            Many developers ride out into the industry without any training in
            accessibility. The web frontier is lawless &mdash; the vast majority
            of websites have accessibility issues that keep folks with
            disabilities locked out. This roundup aims to change that by giving
            you practical, hands-on skills to bring law and order to your code.
          </p>
        </section>

        <section aria-labelledby="wcag-heading">
          <h2 id="wcag-heading" className="text-xl font-semibold text-text mb-3 font-display">
            What is WCAG?
          </h2>
          <p className="text-text-muted leading-relaxed mb-3">
            The Web Content Accessibility Guidelines (WCAG) are the law of the
            land, developed by the W3C Web Accessibility Initiative (WAI). They
            provide a shared standard for web content accessibility that serves
            individuals, organizations, and governments worldwide.
          </p>
          <p className="text-text-muted leading-relaxed mb-3">
            WCAG is organized around four laws (POUR):
          </p>
          <ul className="list-disc pl-6 text-text-muted space-y-1">
            <li>
              <strong>Perceivable</strong> &mdash; Content must be presentable in ways
              users can perceive
            </li>
            <li>
              <strong>Operable</strong> &mdash; Interface components must be operable
              by all
            </li>
            <li>
              <strong>Understandable</strong> &mdash; Information and operation must be
              clear as day
            </li>
            <li>
              <strong>Robust</strong> &mdash; Content must be tough enough for
              assistive technologies
            </li>
          </ul>
        </section>

        <section aria-labelledby="levels-heading">
          <h2
            id="levels-heading"
            className="text-xl font-semibold text-text mb-3 font-display"
          >
            Bounty Grades
          </h2>
          <div className="space-y-3">
            <div className="p-4 rounded-lg border border-border bg-surface-muted">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800">
                  Level A &mdash; Bronze Star
                </span>
                <span className="text-sm font-semibold text-text">Minimum</span>
              </div>
              <p className="text-sm text-text-muted">
                The most basic law of the land. Without meeting Level A,
                some folks will find it impossible to access content.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-surface-muted">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-stone-200 text-stone-800">
                  Level AA &mdash; Silver Star
                </span>
                <span className="text-sm font-semibold text-text">
                  Recommended
                </span>
              </div>
              <p className="text-sm text-text-muted">
                The standard most outfits aim for. Required by many laws and
                regulations including the ADA and EU Accessibility Act.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-surface-muted">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-yellow-100 text-yellow-800">
                  Level AAA &mdash; Gold Star
                </span>
                <span className="text-sm font-semibold text-text">
                  Enhanced
                </span>
              </div>
              <p className="text-sm text-text-muted">
                The highest honor on the frontier. Not all content can earn gold,
                but it represents the ultimate standard for specific guidelines.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="resources-heading">
          <h2
            id="resources-heading"
            className="text-xl font-semibold text-text mb-3 font-display"
          >
            Supplies &amp; Provisions
          </h2>
          <ul className="space-y-2">
            {[
              {
                title: "WCAG 2.1 Quick Reference",
                url: "https://www.w3.org/WAI/WCAG21/quickref/",
                desc: "The complete field guide to all WCAG success criteria",
              },
              {
                title: "W3C Web Accessibility Initiative",
                url: "https://www.w3.org/WAI/",
                desc: "Headquarters for web accessibility standards",
              },
              {
                title: "MDN Accessibility Guide",
                url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility",
                desc: "Practical trail maps for developer accessibility",
              },
              {
                title: "The A11Y Project",
                url: "https://www.a11yproject.com/",
                desc: "A posse of developers making accessibility easier",
              },
              {
                title: "WebAIM",
                url: "https://webaim.org/",
                desc: "Training grounds and tools for web accessibility",
              },
            ].map((resource) => (
              <li key={resource.url}>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 rounded-lg border border-border hover:border-primary transition-colors bg-surface-muted"
                >
                  <span className="text-sm font-semibold text-primary">
                    {resource.title}
                  </span>
                  <span className="sr-only"> (opens in new tab)</span>
                  <p className="text-xs text-text-muted mt-0.5">
                    {resource.desc}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

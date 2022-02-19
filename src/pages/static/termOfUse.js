import { useEffect } from "react";
import Banner from "../../components/banner/banner";
import { Link } from "react-router-dom";
export default function TermsOfUse() {
  useEffect(() => {
    window["scrollTo"]({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <>
      <Banner />
      <div className="lg:pt-10 md:pt-5 pt-3.5 text-black w-full bg-theme lg:px-16 xl:px-24 px-4 privacy-policy">
        {/* <Breadcrumbs title="Privacy Policy" category="Blog" /> */}
        <div className="my-5 xl:p-10 lg:p-8 md:p-5 p-5 text-white bg-innerBG rounded-xl">
          <div className="mb-2">
            <div className="">
              <div className="">
                <div className="lg:text-3xl md:text-2xl text-xl font-bold lg:mb-7 md:mb-5 mb-4 uppercase text-center">
                  TERMS & CONDITIONS
                </div>
                <div>
                  <div className="my-2">
                    <div>
                      Please read these Terms and Conditions ("Terms", "Terms
                      and Conditions") carefully before using the
                      https://eventmania.com website (the "Service") operated by
                      Event Mania ("us", "we", or "our").
                    </div>
                    <br />{" "}
                    <div>
                      Your access to and use of the Service is conditioned upon
                      your acceptance of and compliance with these Terms. These
                      Terms apply to all visitors, users and others who wish to
                      access or use the Service.
                    </div>
                    <br />{" "}
                    <div>
                      By accessing or using the Service you agree to be bound by
                      these Terms. If you disagree with any part of the terms
                      then you do not have permission to access the Service.
                    </div>
                  </div>

                  <div>
                    <div className="md:mt-10 mt-3 uppercase text-lg font-semibold mb-4">
                      COMMUNICATIONS
                    </div>
                    <div className="mb-4">
                      By creating an Account on our service, you agree to
                      subscribe to newsletters, marketing or promotional
                      materials and other information we may send. However, you
                      may opt out of receiving any, or all, of these
                      communications from us by following the unsubscribe link
                      or instructions provided in any email we send
                    </div>
                  </div>

                  <div>
                    <div className="md:mt-10 mt-3 uppercase text-lg font-semibold mb-4">
                      PURCHASES
                    </div>
                    <div className="mb-4">
                      If you wish to purchase any product or service made
                      available through the Service ("Purchase"), you may be
                      asked to supply certain information relevant to your
                      Purchase including, without limitation, your credit card
                      number, the expiration date of your credit card, your
                      billing address, and your shipping information.
                    </div>
                    <div className="mb-4">
                      You represent and warrant that: (i) you have the legal
                      right to use any credit card(s) or other payment method(s)
                      in connection with any Purchase; and that (ii) the
                      information you supply to us is true, correct and
                      complete.
                    </div>
                    <div className="mb-4">
                      The service may employ the use of third party services for
                      the purpose of facilitating payment and the completion of
                      Purchases. By submitting your information, you grant us
                      the right to provide the information to these third
                      parties subject to our Privacy Policy.
                    </div>
                    <div className="mb-4">
                      We reserve the right to refuse or cancel your order at any
                      time for reasons including but not limited to: product or
                      service availability, errors in the description or price
                      of the product or service, error in your order or other
                      reasons
                    </div>
                    <div className="mb-4">
                      We reserve the right to refuse or cancel your order if
                      fraud or an unauthorized or illegal transaction is
                      suspected.
                    </div>
                  </div>

                  <div>
                    <div className="md:mt-10 mt-3 uppercase text-lg font-semibold mb-4">
                      REFUND POLICY
                    </div>
                    <div className="mb-4">
                      Refunds will be offered at our sole discretion and must
                      meet all of the following conditions fully:
                    </div>
                    <ul className="list-disc my-3 ml-5">
                      <li className="mb-2">
                        You are within the first 7 days of the purchase of the
                        plugin
                      </li>
                      <li className="mb-2">
                        Your issue(s) comes from not being able to get the
                        plugin to perform its basic functions advertised on our
                        website
                      </li>
                      <li className="mb-2">
                        You have attempted to resolve your issue(s) with our
                        support team and gave all the access data required (FTP,
                        WP-ADMIN etc) for fixing all reported issue(s)
                      </li>

                      <li className="mb-2">
                        No refunds will be granted after the first 7 days of the
                        original purchase whatsoever.
                      </li>

                      <li className="mb-2">
                        No refunds will be granted if Event Mania does not fit
                        your needs or expectations (please request access to the
                        demo account prior to a purchase).
                      </li>

                      <li className="mb-2">
                        Issues caused by a plugin(s) marked as a BETA (beta
                        version) will not provide grounds for a refund.
                      </li>

                      <li className="mb-2">
                        Issues caused by 3rd party plugins, themes or other
                        software will not provide grounds for a refund.
                      </li>

                      <li className="mb-2">
                        Issues caused by 3rd party developers and/or
                        customizations will not provide grounds for a refund.
                      </li>

                      <li className="mb-2">
                        Refund is not applicable for membership renewal.
                      </li>
                    </ul>
                    <div className="mt-2">
                      By purchasing plugin(s) and/or applications from our site,
                      you agree to this refund policy and relinquish any rights
                      to subject it to any questions, judgment or legal actions.
                    </div>
                  </div>

                  <div>
                    <div className="md:mt-10 mt-3 uppercase text-lg font-semibold mb-4">
                      AVAILABILITY, ERRORS AND INACCURACIES
                    </div>
                    <div className="mb-4">
                      We are constantly updating product and service offerings
                      on the Service. We may experience delays in updating
                      information on the Service and in our advertising on other
                      web sites. The information found on the Service may
                      contain errors or inaccuracies and may not be complete or
                      current. Products or services may be mispriced, described
                      inaccurately, or unavailable on the Service and we cannot
                      guarantee the accuracy or completeness of any information
                      found on the Service.
                    </div>
                    <div className="mb-4">
                      We therefore reserve the right to change or update
                      information and to correct errors, inaccuracies, or
                      omissions at any time without prior notice.
                    </div>
                  </div>

                  <div>
                    <div className="md:mt-10 mt-3 uppercase text-lg font-semibold mb-4">
                      CONTESTS, SWEEPSTAKES AND PROMOTIONS
                    </div>
                    <div className="mb-4">
                      Any contests, sweepstakes or other promotions
                      (collectively, "Promotions") made available through the
                      Service may be governed by rules that are separate from
                      these Terms & Conditions. If you participate in any
                      Promotions, please review the applicable rules as well as
                      our Privacy Policy. If the rules for a Promotion conflict
                      with these Terms and Conditions, the Promotion rules will
                      apply.
                    </div>
                  </div>

                  <div>
                    <div className="md:mt-10 mt-3 uppercase text-lg font-semibold mb-4">
                      CONTENT
                    </div>
                    <div className="mb-4">
                      Our Service allows you to post, link, store, share and
                      otherwise make available certain information, text,
                      graphics, videos, or other material ("Content"). You are
                      responsible for the Content that you post on or through
                      the Service, including its legality, reliability, and
                      appropriateness.
                    </div>
                    <div className="mb-4">
                      By posting Content on or through the Service, You
                      represent and warrant that: (i) the Content is yours (you
                      own it) and/or you have the right to use it and the right
                      to grant us the rights and license as provided in these
                      Terms, and (ii) that the posting of your Content on or
                      through the Service does not violate the privacy rights,
                      publicity rights, copyrights, contract rights or any other
                      rights of any person or entity. We reserve the right to
                      terminate the account of anyone found to be infringing on
                      a copyright.
                    </div>
                    <div className="mb-4">
                      You retain any and all of your rights to any Content you
                      submit, post or display on or through the Service and you
                      are responsible for protecting those rights. We take no
                      responsibility and assume no liability for Content you or
                      any third party posts on or through the Service. However,
                      by posting Content using the Service you grant us the
                      right and license to use, modify, perform, display,
                      reproduce, and distribute such Content on and through the
                      Service.
                    </div>
                    <div className="mb-4">
                      Event Mania has the right but not the obligation to
                      monitor and edit all Content provided by users
                    </div>
                    <div className="mb-4">
                      In addition, Content found on or through this Service are
                      the property of Event Mania or used with permission. You
                      may not distribute, modify, transmit, reuse, download,
                      repost, copy, or use said Content, whether in whole or in
                      part, for commercial purposes or for personal gain,
                      without express advance written permission from us.
                    </div>
                  </div>

                  <div>
                    <div className="md:mt-10 mt-3 uppercase text-lg font-semibold mb-4">
                      ACCOUNTS
                    </div>
                    <div className="mb-4">
                      When you create an account with us, you guarantee that you
                      are above the age of 18, and that the information you
                      provide us is accurate, complete, and current at all
                      times. Inaccurate, incomplete, or obsolete information may
                      result in the immediate termination of your account on the
                      Service.
                    </div>
                    <div className="mb-4">
                      You are responsible for maintaining the confidentiality of
                      your account and password, including but not limited to
                      the restriction of access to your computer and/or account.
                      You agree to accept responsibility for any and all
                      activities or actions that occur under your account and/or
                      password, whether your password is with our Service or a
                      third-party service. You must notify us immediately upon
                      becoming aware of any breach of security or unauthorized
                      use of your account.
                    </div>
                    <div className="mb-4">
                      You may not use as a username the name of another person
                      or entity or that is not lawfully available for use, a
                      name or trademark that is subject to any rights of another
                      person or entity other than you, without appropriate
                      authorization. You may not use as a username any name that
                      is offensive, vulgar or obscene.
                    </div>
                    <div className="mb-4">
                      We reserve the right to refuse service, terminate
                      accounts, remove or edit content, or cancel orders in our
                      sole discretion.
                    </div>
                  </div>

                  <div>
                    <div className="md:mt-10 mt-3 uppercase text-lg font-semibold mb-4">
                      COPYRIGHT POLICY
                    </div>
                    <div className="mb-4">
                      We respect the intellectual property rights of others. It
                      is our policy to respond to any claim that Content posted
                      on the Service infringes on the copyright or other
                      intellectual property rights ("Infringement") of any
                      person or entity.
                    </div>
                    <div className="mb-4">
                      If you are a copyright owner, or authorized on behalf of
                      one, and you believe that the copyrighted work has been
                      copied in a way that constitutes copyright infringement,
                      please submit your claim via email to info@eventmania.com,
                      with the subject line: "Copyright Infringement" and
                      include in your claim a detailed description of the
                      alleged Infringement as detailed below, under "DMCA Notice
                      and Procedure for Copyright Infringement Claims".
                    </div>
                    <div className="mb-4">
                      You may be held accountable for damages (including costs
                      and attorneys' fees) for misrepresentation or bad-faith
                      claims on the infringement of any Content found on and/or
                      through the Service on your copyright.
                    </div>
                  </div>

                  <div>
                    <div className="md:mt-10 mt-3 uppercase text-lg font-semibold mb-4">
                      DMCA NOTICE AND PROCEDURE FOR COPYRIGHT INFRINGEMENT
                      CLAIMS
                    </div>
                    <div className="mb-4">
                      You may submit a notification pursuant to the Digital
                      Millennium Copyright Act (DMCA) by providing our Copyright
                      Agent with the following information in writing (see 17
                      U.S.C 512(c)(3) for further detail):
                    </div>
                    <ul className="list-disc my-3 ml-5">
                      <li className="mb-2">
                        an electronic or physical signature of the person
                        authorized to act on behalf of the owner of the
                        copyright's interest;
                      </li>
                      <li className="mb-2">
                        a description of the copyrighted work that you claim has
                        been infringed, including the URL (i.e., web page
                        address) of the location where the copyrighted work
                        exists or a copy of the copyrighted work;
                      </li>
                      <li className="mb-2">
                        identification of the URL or other specific location on
                        the Service where the material that you claim is
                        infringing is located;
                      </li>

                      <li className="mb-2">
                        your address, telephone number, and email address;
                      </li>

                      <li className="mb-2">
                        a statement by you that you have a good faith belief
                        that the disputed use is not authorized by the copyright
                        owner, its agent, or the law;
                      </li>

                      <li className="mb-2">
                        a statement by you, made under penalty of perjury, that
                        the above information in your notice is accurate and
                        that you are the copyright owner or authorized to act on
                        the copyright owner's behalf.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <div className="md:mt-10 mt-3 uppercase text-lg font-semibold mb-4">
                      INTELLECTUAL PROPERTY
                    </div>
                    <div className="mb-4">
                      The Service and its original content (excluding Content
                      provided by users), features and functionality are and
                      will remain the exclusive property of Event Mania and its
                      licensors. The Service is protected by copyright,
                      trademark, and other laws of both the United States and
                      foreign countries. Our trademarks and trade dress may not
                      be used in connection with any product or service without
                      the prior written consent of Event Mania.
                    </div>
                    <div className="mb-4">
                      There are some cases where you can use Event Mania without
                      asking permission, and some for which our permission is
                      required.
                    </div>
                    <div className="mb-4">
                      You can use Event Mania® without advance permission to:
                    </div>
                    <div className="mb-4">
                      We reserve the right to refuse service, terminate
                      accounts, remove or edit content, or cancel orders in our
                      sole discretion.
                    </div>
                    <ul className="my-3 ml-5">
                      <li className="mb-2">
                        - Truthfully describe Event Mania products.
                      </li>
                      <li className="mb-2">
                        - Report news or information about Event Mania, its
                        plugins, add-ons and related applications.
                      </li>

                      <li className="mb-2">- Link to our site.</li>
                    </ul>
                    <div className="mb-4">
                      If you'd like to use Event Mania® for reasons other than
                      those listed above, please ask our permission by
                      contacting us via e-mail info@eventmania.com. We'll review
                      all requests and grant permission to selected projects.
                      Please note that we do not allow the use of Event Mania®
                      in advertising.
                    </div>
                  </div>

                  <div>
                    <div className="md:mt-10 mt-3 uppercase text-lg font-semibold mb-4">
                      LINKS TO OTHER WEB SITES
                    </div>
                    <div className="mb-4">
                      Our Service may contain links to third party web sites or
                      services that are not owned or controlled by Event Mania.
                    </div>
                    <div className="mb-4">
                      Event Mania has no control over, and assumes no
                      responsibility for the content, privacy policies, or
                      practices of any third party web sites or services. We do
                      not warrant the offerings of any of these
                      entities/individuals or their websites.
                    </div>
                    <div className="mb-4">
                      You acknowledge and agree that Event Mania shall not be
                      responsible or liable, directly or indirectly, for any
                      damage or loss caused or alleged to be caused by or in
                      connection with use of or reliance on any such content,
                      goods or services available on or through any such third
                      party web sites or services.
                    </div>
                    <div className="mb-4">
                      We strongly advise you to read the terms and conditions
                      and privacy policies of any third party web sites or
                      services that you visit.
                    </div>
                  </div>

                  <div>
                    <div className="md:mt-10 mt-3 uppercase text-lg font-semibold mb-4">
                      TERMINATION
                    </div>
                    <div className="mb-4">
                      We may terminate or suspend your account and bar access to
                      the Service immediately, without prior notice or
                      liability, under our sole discretion, for any reason
                      whatsoever and without limitation, including but not
                      limited to a breach of the Terms.
                    </div>
                    <div className="mb-4">
                      If you wish to terminate your account, you may simply
                      discontinue using the Service.
                    </div>
                    <div className="mb-4">
                      All provisions of the Terms which by their nature should
                      survive termination shall survive termination, including,
                      without limitation, ownership provisions, warranty
                      disclaimers, indemnity and limitations of liability.
                    </div>
                  </div>

                  <div>
                    <div className="md:mt-10 mt-3 uppercase text-lg font-semibold mb-4">
                      INDEMNIFICATION
                    </div>
                    <div className="mb-4">
                      You agree to defend, indemnify and hold harmless Event
                      Mania and its licensee and licensors, and their employees,
                      contractors, agents, officers and directors, from and
                      against any and all claims, damages, obligations, losses,
                      liabilities, costs or debt, and expenses (including but
                      not limited to attorney's fees), resulting from or arising
                      out of a) your use and access of the Service, by you or
                      any person using your account and password; b) a breach of
                      these Terms, or c) Content posted on the Service.
                    </div>
                  </div>

                  <div>
                    <div className="md:mt-10 mt-3 uppercase text-lg font-semibold mb-4">
                      LIMITATION OF LIABILITY
                    </div>
                    <div className="mb-4">
                      In no event shall Event Mania, nor its directors,
                      employees, partners, agents, suppliers, or affiliates, be
                      liable for any indirect, incidental, special,
                      consequential or punitive damages, including without
                      limitation, loss of profits, data, use, goodwill, or other
                      intangible losses, resulting from (i) your access to or
                      use of or inability to access or use the Service; (ii) any
                      conduct or content of any third party on the Service;
                      (iii) any content obtained from the Service; and (iv)
                      unauthorized access, use or alteration of your
                      transmissions or content, whether based on warranty,
                      contract, tort (including negligence) or any other legal
                      theory, whether or not we have been informed of the
                      possibility of such damage, and even if a remedy set forth
                      herein is found to have failed of its essential purpose.
                    </div>
                  </div>

                  <div>
                    <div className="md:mt-10 mt-3 uppercase text-lg font-semibold mb-4">
                      DISCLAIMER
                    </div>
                    <div className="mb-4">
                      Your use of the Service is at your sole risk. The Service
                      is provided on an "AS IS" and "AS AVAILABLE" basis. The
                      Service is provided without warranties of any kind,
                      whether express or implied, including, but not limited to,
                      implied warranties of merchantability, fitness for a
                      particular purpose, non-infringement or course of
                      performance.
                    </div>
                    <div className="mb-4">
                      Event Mania its subsidiaries, affiliates, and its
                      licensors do not warrant that a) the Service will function
                      uninterrupted, secure or available at any particular time
                      or location; b) any errors or defects will be corrected;
                      c) the Service is free of viruses or other harmful
                      components; or d) the results of using the Service will
                      meet your requirements.
                    </div>
                  </div>

                  <div>
                    <div className="md:mt-10 mt-3 uppercase text-lg font-semibold mb-4">
                      EXCLUSIONS
                    </div>
                    <div className="mb-4">
                      Some jurisdictions do not allow the exclusion of certain
                      warranties or the exclusion or limitation of liability for
                      consequential or incidental damages, so the limitations
                      above may not apply to you.
                    </div>
                  </div>

                  <div>
                    <div className="md:mt-10 mt-3 uppercase text-lg font-semibold mb-4">
                      GOVERNING LAW
                    </div>
                    <div className="mb-4">
                      These Terms shall be governed and construed in accordance
                      with the laws of California, United States, without regard
                      to its conflict of law provisions.
                    </div>
                    <div className="mb-4">
                      Our failure to enforce any right or provision of these
                      Terms will not be considered a waiver of those rights. If
                      any provision of these Terms is held to be invalid or
                      unenforceable by a court, the remaining provisions of
                      these Terms will remain in effect. These Terms constitute
                      the entire agreement between us regarding our Service, and
                      supersede and replace any prior agreements we might have
                      had between us regarding the Service.
                    </div>
                  </div>

                  <div>
                    <div className="md:mt-10 mt-3 uppercase text-lg font-semibold mb-4">
                      CHANGES
                    </div>
                    <div className="mb-4">
                      We reserve the right, at our sole discretion, to modify or
                      replace these Terms at any time. If a revision is material
                      we will provide at least 15 days notice prior to any new
                      terms taking effect. What constitutes a material change
                      will be determined at our sole discretion.
                    </div>
                    <div className="mb-4">
                      By continuing to access or use our Service after any
                      revisions become effective, you agree to be bound by the
                      revised terms. If you do not agree to the new terms, you
                      are no longer authorized to use the Service.
                    </div>
                  </div>

                  <div>
                    <div className="md:mt-10 mt-3 uppercase text-lg font-semibold mb-4">
                      CONTACT US
                    </div>
                    <div className="mb-4">
                      If you have any questions about these Terms, please{" "}
                      <Link to="/contact-us">contact us.</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
        </div>
      </div>
    </>
  );
}

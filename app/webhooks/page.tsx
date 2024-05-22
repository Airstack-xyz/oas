"use client";
import ReactSwagger from "../components/react-swagger";
import webhooksSwaggerDocument from "../swagger/webhooks.json";

export default function IndexPage() {
  return (
    <section className="container">
      <ReactSwagger spec={webhooksSwaggerDocument} />
    </section>
  );
}

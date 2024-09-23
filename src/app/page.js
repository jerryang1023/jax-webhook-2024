import Image from "next/image";
import styles from "./page.module.css";
import {eventWorker} from "@/lib/eventHandler.js";
import {webhookWorker} from "@/lib/webhookHandler.js";

export default function Home() {

    eventWorker.on('completed', job => {
        console.log(`Event Worker job: ${job.id} has completed!`);
    });
    eventWorker.on('failed', (job, err) => {
        console.log(`Event Worker job: ${job.id} has failed with ${err.message}`);
    });

    webhookWorker.on('completed', job => {
        console.log(`Webhook Worker job: ${job.id} has completed!`);
    });
    webhookWorker.on('failed', (job, err) => {
        console.log(`Webhook Worker job: ${job.id} has failed with ${err.message}`);
    });

  return (
    <div className={styles.page}>
      <p1>JAX Webhook Workshop 2024</p1>
    </div>
  );
}

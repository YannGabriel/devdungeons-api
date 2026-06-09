import { NestFactory, Reflector } from "@nestjs/core";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix("/api");

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector)),
    );

    app.enableCors({
        origin: process.env.CORS_ORIGIN?.split(",") ?? ["http://localhost:5173"],
        credentials: true,
    });

    const swaggerConfig = new DocumentBuilder()
        .setTitle("DevDungeons API")
        .setDescription(
            "API de quiz gamificado para aprendizado de programação. " +
            "Use POST /api/auth/login para obter o token e clique em **Authorize**.",
        )
        .setVersion("1.0")
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("api/docs", app, document, {
        swaggerOptions: { persistAuthorization: true },
    });

    await app.listen(process.env.PORT ?? 3000);

    const url = `http://localhost:${process.env.PORT ?? 3000}`;
    console.log(`Application running on: ${url}/api`);
    console.log(`Swagger docs:           ${url}/api/docs`);
}

bootstrap();

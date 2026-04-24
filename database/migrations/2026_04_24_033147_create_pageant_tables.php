<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Event Table
        Schema::create('event', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
        });

        // 2. Category Table
        Schema::create('category', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->nullable()->constrained('event')->nullOnDelete();
            $table->string('name', 100);
            $table->boolean('is_minor')->default(false);
        });

        // 3. Category Criteria Table
        Schema::create('category_criteria', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('category')->cascadeOnDelete();
            $table->string('name', 100);
            $table->decimal('percentage', 5, 2)->nullable();
            $table->integer('min_score')->nullable();
            $table->integer('max_score')->nullable();
        });

        // 4. Contestant Table
        Schema::create('contestant', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->nullable()->constrained('event')->nullOnDelete();
            $table->string('name', 100);
            $table->integer('number')->nullable();
            $table->string('status', 50)->nullable();
        });

        // 5. Judge Table
        Schema::create('judge', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->nullable()->constrained('event')->nullOnDelete();
            $table->string('name', 100);
            $table->string('number', 50)->nullable();
            $table->string('pin', 20)->nullable();
        });

        // 6. Score Table
        Schema::create('score', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('category')->cascadeOnDelete();
            $table->foreignId('judge_id')->constrained('judge')->cascadeOnDelete();
            $table->foreignId('contestant_id')->constrained('contestant')->cascadeOnDelete();
            $table->foreignId('criteria_id')->constrained('category_criteria')->cascadeOnDelete();
            $table->decimal('value', 5, 2)->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('score');
        Schema::dropIfExists('judge');
        Schema::dropIfExists('contestant');
        Schema::dropIfExists('category_criteria');
        Schema::dropIfExists('category');
        Schema::dropIfExists('event');
    }
};